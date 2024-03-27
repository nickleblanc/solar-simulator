from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
from datetime import date
from histsearch import histsearch
from forecast import forecast_tool

server = Flask(__name__)
CORS(server)
        
lat="45.964993";
lon="-66.646332";

stc=385;
ptc=288.3;
v_mp=40.24;
i_mp=9.57
v_oc=49.57
i_sc=10.05
alpha=0.04
beta=-0.27
gamma=-0.35
n_s=144

pac=1000000
pdc=1000000
vdc=600
# panelnum=10
panelsrs=15

inverter_params = {
    'Paco': pac,   # AC Power rating  User provided
    'Pso': pac*0.01, # power consumed by inverter 1% of Ac rating is reasonable 
    'Pdco': pdc, # Dc power input resulting in Paco at reference voltage   User provided
    'Vdco': vdc, # dc reference voltage     User provided
    'C0': 0, #  (assumed 0 without experimental data)
    'C1': 0, #  (assumed 0 without experimental data)
    'C2': 0, # (assumed 0 without experimental data)
    'C3': 0, # (assumed 0 without experimental data)
    'Pnt': 1, # Power consumed at night
} 

panel_params = {
    'stc': 600,
    'ptc': 454,
    'v_mp': 44,
    'i_mp': 13.64,
    'v_oc': 51.8,
    'i_sc': 14.54,
    'alpha': 0.05,
    'beta': -0.25,
    'gamma': -0.29,
    'n_s': 144,
    'temp_ref': 25
}

def string_to_date(date_string):
    date_list = date_string.split(",", -1)
    return date(int(date_list[0]), int(date_list[1]), int(date_list[2]))

@server.route('/hist', methods=['POST'])
def hist():
    print(request.get_json())
    panel_params=request.get_json()['parameters']
    num_panels=request.get_json()['numPanels']
    start=string_to_date(request.get_json()['start'])
    end=string_to_date(request.get_json()['end'])
    num_locations=request.get_json()['numLocations']
    return jsonify({'histsearch': histsearch(lat=lat, lon=lon, start=start, end=end, num_panels=num_panels, panel_params=panel_params, panel_series=panelsrs, inverter_data=inverter_params, num_locations=num_locations)})

@server.route('/forecast', methods=['POST'])
def forecast():
    print(request.get_json())
    panel_params=request.get_json()['parameters']
    num_panels=request.get_json()['numPanels']
    num_locations=request.get_json()['numLocations']
    return jsonify({'forecast': forecast_tool(lat, lon, num_panels=num_panels, panel_series=panelsrs, panel_params=panel_params, inverter_data=inverter_params, num_locations=num_locations)})

if __name__ == '__main__':
    server.run(host='0.0.0.0', port=5001)