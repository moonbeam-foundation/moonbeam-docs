
docker run --network="host" -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
 moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} key generate-node-key --base-path /var/lib/moonbeam-data --chain moonbeam 
