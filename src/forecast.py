# -*- coding: utf-8 -*-
"""
Created on Wed Feb 21 14:14:59 2024

@author: noahj
"""

def forecast_tool(lat, lon,panelnum,panelseries,panel_data,inverter_data,numlocations):
    import pvlib
    from pvlib import pvsystem 
    import numpy as np
    import matplotlib.pyplot as plt
    import pandas as pd
    import openmeteo_requests

    from datetime import datetime, timedelta
    import requests_cache
    import pandas as pd
    from retry_requests import retry
    # from requests_cache import DO_NOT_CACHE

    inverter_data_copy=inverter_data.copy()
    inverter_data_copy['Paco']=inverter_data_copy['Paco']*numlocations
    
    ## Calling weather API openmeteo
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache',cache_control=True, expire_after=120)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
    	"latitude": lat,
    	"longitude": lon,
    	"minutely_15": ["temperature_2m", "direct_normal_irradiance"],
    	"timezone": "auto",
    	"forecast_days": 3
    }
    responses = openmeteo.weather_api(url, params=params)

    response = responses[0]


    # Process minutely_15 data. The order of variables needs to be the same as requested.
    minutely_15 = response.Minutely15()
    minutely_15_temperature_2m = minutely_15.Variables(0).ValuesAsNumpy()
    minutely_15_direct_normal_irradiance = minutely_15.Variables(1).ValuesAsNumpy()

    minutely_15_data = {"date": pd.date_range(
    	start = pd.to_datetime(minutely_15.Time(), unit = "s", utc = True),
    	end = pd.to_datetime(minutely_15.TimeEnd(), unit = "s", utc = True),
    	freq = pd.Timedelta(seconds = minutely_15.Interval()),
    	inclusive = "left"
    )}
    minutely_15_data["temperature_2m"] = minutely_15_temperature_2m
    minutely_15_data["direct_normal_irradiance"] = minutely_15_direct_normal_irradiance

    ## Running Solar model

    cec_fit_params = pvlib.ivtools.sdm.fit_cec_sam('monoSi', panel_data['V_mp_ref'], panel_data['I_mp_ref'],
                                     panel_data['V_oc_ref'], panel_data['I_sc_ref'], panel_data['alpha_sc'],
                                     panel_data['beta_oc'], panel_data['gamma_r'], 
                                      panel_data['N_s'], 25)

    irrad=minutely_15_direct_normal_irradiance
    temp_amb=minutely_15_temperature_2m
    temp_cell=temp_amb+(41-20)/800*irrad

    # 2nd step: Apply model to estimate the 5 parameters of the single diode equation using the CEC model



    diode_params = pvlib.pvsystem.calcparams_cec(irrad, temp_cell, panel_data['alpha_sc'], cec_fit_params[4], 
                                                cec_fit_params[0], cec_fit_params[1], cec_fit_params[3], 
                                                cec_fit_params[2], cec_fit_params[5])
    # This returns the parameters needed for model
    #print(diode_params)

    iv_values1 = pvlib.pvsystem.singlediode(diode_params[0], 
                                            diode_params[1], 
                                            diode_params[2], 
                                            diode_params[3], 
                                            diode_params[4], 
                                            ivcurve_pnts=25,   # Number of points of the I-V curve (equally distributed)
                                            method='lambertw') # I-V using the Lambert W. function

    acpower =pvlib.inverter.sandia(iv_values1['v_mp']*panelseries, # DC voltage input to the inverter
                                    iv_values1['p_mp']*panelnum, # DC power input to the inverter
                                     inverter_data_copy) # Parameters for the inverter 
    times=minutely_15_data['date']-timedelta(hours=3)
    
    
    times=times.strftime("%m/%d %H:%M")

    object = {
        "times": times.tolist(),
        "acpower": acpower.tolist()
    }
    return object
