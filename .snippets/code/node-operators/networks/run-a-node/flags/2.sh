docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--help
