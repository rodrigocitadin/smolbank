# Smolbank

Clients -> Traefik -> multiple Phoenix API instances
  |-> APIs produce events -> Kafka/Redpanda (durable)
  |-> APIs write append-only WAL (Postgres events table)
Kafka -> Consumers/Projectors -> update Read DB (Postgres) + ETS cache + optional TigerBeetle ledger
Account GenServers supervised -> keep in-memory state, rehydrate from WAL/Read DB at startup
PubSub -> LiveView updates
Observability: Prometheus / Grafana / OpenTelemetry/Jaeger / Loki
Local: Docker Compose (Redpanda), later K8s + Terraform + Traefik
