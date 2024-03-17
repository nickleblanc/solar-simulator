# -*- coding: utf-8 -*-
"""
Created on Thu Feb 29 10:37:30 2024

@author: noahj
"""

def histsearch(lat,lon,start,end,num_panels,panel_params,inverter_data,num_locations):
    import pvlib
    from pvlib import pvsystem 
    import numpy as np
    import matplotlib.pyplot as plt
    import pandas as pd
    import openmeteo_requests
    from datetime import datetime, timedelta, date
    import requests_cache
    import pandas as pd
    from retry_requests import retry
    # from requests_cache import DO_NOT_CACHE 

    print(panel_params)

    print(num_locations)
    inverter_data_copy=inverter_data.copy()
    inverter_data_copy['Paco']=inverter_data_copy['Paco']*num_locations
    inverter_data_copy['Pdco']=inverter_data_copy['Pdco']*num_locations
    
    ## Calling weather API openmeteo
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache',cache_control=True, expire_after=120)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)
    
    cutoff=date.today()-timedelta(weeks=12)
    
    if start>=cutoff :
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
	"latitude": lat,
	"longitude": lon,
	"minutely_15": ["temperature_2m", "direct_normal_irradiance"],
	"timezone": "auto",
	"start_date": start,
	"end_date": end
}
    
        responses = openmeteo.weather_api(url, params=params)

        # Process first location. Add a for-loop for multiple locations or weather models
        response = responses[0]

        # Process minutely_15 data. The order of variables needs to be the same as requested.
        minutely_15 = response.Minutely15()
        minutely_15_temperature_2m = minutely_15.Variables(0).ValuesAsNumpy()
        minutely_15_direct_normal_irradiance = minutely_15.Variables(1).ValuesAsNumpy()
    
        minutely_15_data = {"date": pd.date_range(
            start = pd.to_datetime(minutely_15.Time(), unit = "s", utc = True),
            end= pd.to_datetime(minutely_15.TimeEnd(), unit = "s", utc = True),
            freq = pd.Timedelta(seconds = minutely_15.Interval()),
            inclusive = "left"
             )}
        minutely_15_data["temperature_2m"] = minutely_15_temperature_2m
        minutely_15_data["direct_normal_irradiance"] = minutely_15_direct_normal_irradiance

        minutely_15_dataframe = pd.DataFrame(data = minutely_15_data)

    ## Running Solar model

        cec_fit_params = pvlib.ivtools.sdm.fit_cec_sam('monoSi', panel_params['v_mp'], panel_params['i_mp'],
                         panel_params['v_oc'], panel_params['i_sc'], panel_params['alpha_sc'],
                        panel_params['beta_oc'], panel_params['gamma_r'], 
                        panel_params['n_s'], 25)

        irrad=minutely_15_direct_normal_irradiance
        temp_amb=minutely_15_temperature_2m
        temp_cell=temp_amb+(41-20)/800*irrad
        
        
        # 2nd step: Apply model to estimate the 5 parameters of the single diode equation using the CEC model

        diode_params = pvlib.pvsystem.calcparams_cec(irrad, temp_cell, panel_params['alpha_sc'], cec_fit_params[4], 
                                                    cec_fit_params[0], cec_fit_params[1], cec_fit_params[3], 
                                                    cec_fit_params[2], cec_fit_params[5])
        # This returns the parameters needed for model
        
        iv_values1 = pvlib.pvsystem.singlediode(diode_params[0], 
                                                diode_params[1], 
                                                diode_params[2], 
                                                diode_params[3], 
                                                diode_params[4], 
                                                ivcurve_pnts=25,   # Number of points of the I-V curve (equally distributed)
                                                method='lambertw') # I-V using the Lambert W. function
        acpower =pvlib.inverter.sandia(iv_values1['v_mp']*panel_params["n_s"], # DC voltage input to the inverter
                                        iv_values1['p_mp']*num_panels, # DC power input to the inverter
                                         inverter_data_copy) # Parameters for the inverter 
        times=minutely_15_data['date']-timedelta(hours=3)

        times=times.strftime("%m/%d %H:%M")

        object = {
            "times": times.tolist(),
            "acpower": acpower.tolist()
        }
        return object
    else:
      url = "https://archive-api.open-meteo.com/v1/archive"
      params = {
	"latitude": lat,
	"longitude": lon,
	"start_date": start,
	"end_date": end,
	"hourly": ["temperature_2m", "direct_normal_irradiance"],
	"timezone": "auto"
        }
      responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]  
    
    
    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_direct_normal_irradiance = hourly.Variables(1).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
	start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
	end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = hourly.Interval()),
	inclusive = "left"
)}
    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["direct_normal_irradiance"] = hourly_direct_normal_irradiance

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    ## Running Solar model

    cec_fit_params = pvlib.ivtools.sdm.fit_cec_sam('monoSi', panel_params['v_mp'], panel_params['i_mp'],
                         panel_params['v_oc'], panel_params['i_sc'], panel_params['alpha_sc'],
                        panel_params['beta_oc'], panel_params['gamma_r'], 
                        panel_params['n_s'], 25)

    irrad=hourly_direct_normal_irradiance
    temp_amb=hourly_temperature_2m
    temp_cell=temp_amb+(41-20)/800*irrad
        
        
        # 2nd step: Apply model to estimate the 5 parameters of the single diode equation using the CEC model



    diode_params = pvlib.pvsystem.calcparams_cec(irrad, temp_cell, panel_params['alpha_sc'], cec_fit_params[4], 
                                                    cec_fit_params[0], cec_fit_params[1], cec_fit_params[3], 
                                                    cec_fit_params[2], cec_fit_params[5])
        # This returns the parameters needed for model
        
    iv_values1 = pvlib.pvsystem.singlediode(diode_params[0], 
                                                diode_params[1], 
                                                diode_params[2], 
                                                diode_params[3], 
                                                diode_params[4], 
                                                ivcurve_pnts=25,   # Number of points of the I-V curve (equally distributed)
                                                method='lambertw') # I-V using the Lambert W. function
    acpower =pvlib.inverter.sandia(iv_values1['v_mp']*panel_params["n_s"], # DC voltage input to the inverter
                                        iv_values1['p_mp']*num_panels, # DC power input to the inverter
                                         inverter_data_copy) # Parameters for the inverter 
    times=hourly_data['date']-timedelta(hours=3)

    times=times.strftime("%m/%d %H:%M")

    object = {
        "times": times.tolist(),
        "acpower": acpower.tolist()
    }
    return object
