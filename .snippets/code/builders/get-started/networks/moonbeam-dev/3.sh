docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
--dev --rpc-external
