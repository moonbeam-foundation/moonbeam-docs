# chown to a specific user
chown INSERT_DOCKER_USER {{ networks.moonbeam.node_directory }}

# chown to current user
sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
