# Bin Monitoring Hardware Integration

This project now accepts ultrasonic bin readings directly from the device.

## Sensor payload

Send a `POST` request to:

`/api/sensor/update`

Headers:

- `Content-Type: application/json`
- `x-device-key: <DEVICE_SECRET>`

Body:

```json
{
  "bin_id": 1,
  "distance_cm": 11.55,
  "status": "FULL"
}
```

## Threshold mapping

The backend maps your hardware readings like this:

- `< 15 cm` -> `FULL`
- `< 40 cm` -> `HALF`
- `>= 40 cm` -> `EMPTY`

It also converts those readings into the app's internal bin state:

- `FULL` -> `status = full`, `current_fill = 95`
- `HALF` -> `status = active`, `current_fill = 50`
- `EMPTY` -> `status = empty`, `current_fill = 0`

## Database update for existing installs

If your database already exists, run:

```sql
ALTER TABLE bins
  ADD COLUMN latest_distance_cm DECIMAL(10, 2) NULL,
  ADD COLUMN sensor_status VARCHAR(20) NULL;

ALTER TABLE sensor_data
  ADD COLUMN distance_cm DECIMAL(10, 2) NULL,
  ADD COLUMN sensor_status VARCHAR(20) NULL;
```

## ESP32 sketch

Use the sketch in:

`hardware/esp32_bin_monitor.ino`

Update these values before uploading:

- `WIFI_SSID`
- `WIFI_PASSWORD`
- `API_URL`
- `DEVICE_SECRET`
- `BIN_ID`
