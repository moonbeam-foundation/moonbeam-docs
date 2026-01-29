docker run --rm --name {{ networks.development.container_name }} --network host \
moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
--dev --rpc-external
