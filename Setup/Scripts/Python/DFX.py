
import subprocess, sys, os, shutil, json
from pathlib import Path
pybin = sys.executable#
cwd = os.getcwd()

def remove_frontend(filename='data.json'):
	with open(filename,'r+') as file:
		file_data = json.load(file) # First we load existing data into a dict.
		if "frontend" in file_data["canisters"]:
			del file_data["canisters"]["frontend"] # Join new_data with file_data inside emp_details
			file.seek(0) # Sets file's current position at offset.
			json.dump(file_data, file, indent = 4) # convert back to json.

# write_json(frontend_canister) 
arg = sys.argv[1] if len(sys.argv)>1 else ""
dfx_file = os.path.join(cwd, "ICP/B3/dfx.json")
original_dfx_file = os.path.join(cwd, "ICP/B3/-dfx.json")

if arg=="backup":
	if not os.path.isfile(original_dfx_file): dest = shutil.copy2(dfx_file, original_dfx_file) 
	remove_frontend(dfx_file)

elif arg=="restore":
	dest = shutil.copy2(original_dfx_file, dfx_file)
	# os.remove(original_dfx_file)
