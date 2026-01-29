
docker run --network="host" -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
 moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} key generate-node-key --base-path /var/lib/moonriver-data --chain moonriver 
