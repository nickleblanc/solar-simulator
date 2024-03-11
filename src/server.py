from flask import Flask, request
from flask import jsonify
from flask_cors import CORS

from datetime import datetime ,timedelta,date

from histsearch import histsearch
from forecast import forecast_tool

server = Flask(__name__)
CORS(server)
        
lat="45.964993";
lon="-66.646332";
stc=600;
ptc=454;
v_mp=44;
i_mp=13.64
v_oc=51.8
i_sc=14.54
alpha=0.05
beta=-0.25
gamma=-0.29
n_s=144
pac=3800
pdc=6000
vdc=600
# panelnum=10
panelsrs=2


## entering panel paramters
module_data = {'Technology': 'monocrystalline Q.ANTUM solar half cells', # technology
         'STC': stc, # STC power
         'PTC': ptc, # PTC power
         'V_mp_ref': v_mp, # Maximum power voltage under STC
         'I_mp_ref': i_mp, # Maximum power current under STC
         'V_oc_ref': v_oc, # Open-circuit voltage under STC
         'I_sc_ref': i_sc, # Short-circuit current under STC
         'alpha_sc': alpha, # Temperature Coeff. Short Circuit Current [A/C]
         'beta_oc': beta, # Temperature Coeff. Open Circuit Voltage [V/C]
         'gamma_r': gamma, # Temperature coefficient of power at maximum point [%/C]
         'N_s': n_s, # Number of cells in series
         'temp_ref': 25}  # Reference temperature conditions


inverter = {'Paco': pac,   # AC Power rating  User provided
                     'Pso': pac*0.01, # power consumed by inverter 1% of Ac rating is reasonable 
                     'Pdco': pdc, # Dc power input resulting in Paco at reference voltage   User provided
                     'Vdco': vdc, # dc reference voltage     User provided
                    'C0': 0, #  (assumed 0 without experimental data)
                    'C1': 0, #  (assumed 0 without experimental data)
                    'C2': 0, # (assumed 0 without experimental data)
                    'C3': 0, # (assumed 0 without experimental data)
                    'Pnt': 1, # Power consumed at night
                   } 

start = '2023,1,8'
end = '2023,1,10'

start=start.split(",",-1)
end=end.split(",",-1)
start=date(int(start[0]),int(start[1]),int(start[2]))
end=date(int(end[0]),int(end[1]),int(end[2]))

@server.route('/hist')
def hist():
    # lat=request.args.get('lat')
    # lon=request.args.get('lon')
    panels=request.args.get('panels')
    panels=float(panels)
    print(panels)
    return jsonify({'histsearch': histsearch(lat=lat, lon=lon, start=start, end=end, panelnum=panels, panelseries=panelsrs, panel_data=module_data, inverter_data=inverter)})

@server.route('/forecast')
def forecast():
    # lat=request.args.get('lat')
    # lon=request.args.get('lon')
    panels=request.args.get('panels')
    panels=float(panels)
    print(panels)
    return jsonify({'histsearch': forecast_tool(lat, lon, panelnum=panels, panelseries=panelsrs, panel_data=module_data, inverter_data=inverter)})

if __name__ == '__main__':
    server.run(host='0.0.0.0', port=5001)