
docker run --network="host" -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
 moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} key generate-node-key --base-path /var/lib/alphanet-data --chain alphanet && sudo chown -R moonbase_service  /var/lib/alphanet-data
