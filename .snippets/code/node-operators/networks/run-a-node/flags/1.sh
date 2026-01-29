docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--help
