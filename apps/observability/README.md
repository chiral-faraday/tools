# Observability Stack (Prometheus + Grafana)

![Docker](https://img.shields.io/badge/docker-compose-blue)
![Prometheus](https://img.shields.io/badge/metrics-prometheus-orange)
![Grafana](https://img.shields.io/badge/visualisation-grafana-orange)

A lightweight, containerised observability stack using Docker Compose.

Includes:

* Prometheus (metrics collection & storage)
* Grafana (dashboards & visualisation)
* Provisioned configuration via bind mounts
* Persistent local storage for metrics and dashboards

## Quick Start

```bash
docker compose up -d
```

Access services:

| Service    | URL                                            | Credentials     |
| ---------- | ---------------------------------------------- | --------------- |
| Grafana    | [http://localhost:3069](http://localhost:3069) | admin / grafana |
| Prometheus | [http://localhost:9090](http://localhost:9090) | none            |

## Project Structure

```sh
.
├── compose.yaml
├── config/
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       └── provisioning/
├── data/
│   ├── prometheus/
│   └── grafana/
├── logs/
│   ├── prometheus/
│   └── grafana/
└── docker/
```

## Architecture Overview

* Prometheus scrapes and stores metrics
* Grafana reads Prometheus as a data source
* All configuration is local and versionable
* Data is persisted via bind mounts

## Permissions (IMPORTANT)

This stack uses **bind mounts**, meaning container users must align with host filesystem permissions.

### Why this matters

Each service runs as a non-root user:

| Service    | User    | UID   |
| ---------- | ------- | ----- |
| Prometheus | nobody  | 65534 |
| Grafana    | grafana | 472   |

If host directories are not owned by these UIDs, containers will fail with permission errors.

## 🔍 Inspect container user IDs

```bash
docker run --rm --entrypoint id prom/prometheus
docker run --rm --entrypoint id grafana/grafana
```

Example output:

```sh
uid=472(grafana) gid=0(root)
uid=65534(nobody) gid=65534(nobody)
```

## Fix permission issues

### Grafana

```bash
sudo chown -R 472:472 data/grafana
```

### Prometheus

```bash
sudo chown -R 65534:65534 data/prometheus
```

## Quick (unsafe) workaround

For local testing only:

```bash
chmod -R 777 data logs
```

## Recommended approaches

### Option 1 — Named volumes (best)

Avoid permission issues entirely:

```yaml
volumes:
  - grafana_data:/var/lib/grafana
  - prom_data:/prometheus

volumes:
  grafana_data:
  prom_data:
```

### Option 2 — Match host user

```yaml
user: "${UID}:${GID}"
```

Then:

```bash
export UID=$(id -u)
export GID=$(id -g)
```

## Health checks

```bash
curl http://localhost:9090/-/ready
```

Expected:

```
Prometheus is Ready.
```

## 🧹 Stopping the stack

```bash
docker compose down
```

Remove all data:

```bash
docker compose down -v
```

## Troubleshooting Guide

### ❌ Container keeps restarting

Check logs:

```bash
docker compose logs -f
```

### ❌ “no such file or directory”

* Missing config file (e.g. `prometheus.yml`)
* Verify:

```bash
ls config/prometheus/
```

### ❌ “permission denied”

Check ownership:

```bash
ls -ld data/*
```

Determine id (in container):

```sh
docker run --rm --entrypoint id prom/prometheus
```
Fix:

```bash
sudo chown -R <UID>:<GID> <directory>
```

### ❌ Grafana plugins/data not writable

Determine id (in container):

```sh
docker run --rm --entrypoint id grafana/grafana
```

Fix (using the retrieved id):

```bash
sudo chown -R 472:472 data/grafana
```

---

### ❌ Prometheus TSDB issues

Fix:

```bash
sudo chown -R 65534:65534 data/prometheus
```

## Troubleshooting Flow (Decision Tree)

```
Container fails?
│
├── Missing config file → add YAML to config/
│
├── Permission denied → fix ownership (chown)
│
├── Restart loop → run docker compose logs
│
└── Works but empty UI → check ports + targets
```

## Notes

* First Grafana startup may install plugins (slow initial boot)
* Prometheus requires valid YAML config before starting
* Bind mounts make debugging easier but require permission management

## Next upgrades (optional)

* Loki + Promtail (logs)
* Node Exporter (host metrics)
* Alertmanager (alerting)
* Prebuilt Grafana dashboards
* Docker service discovery

## Summary

This stack prioritises:

* Transparency (all config local)
* Simplicity (no Kubernetes required)
* Observability fundamentals
* Explicit filesystem control
