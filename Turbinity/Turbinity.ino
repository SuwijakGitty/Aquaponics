int turbidityPin = A0;

// Voltage reference
float clearVoltage = 3.9;   // น้ำใส (0 NTU)
float dirtyVoltage = 2.0;   // น้ำโคลน (1000 NTU)

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(turbidityPin);
  float voltage = sensorValue * (5.0 / 1023.0);

  // Map ค่า Voltage -> NTU (0–1000)
  float ntu = map(voltage * 100, dirtyVoltage * 100, clearVoltage * 100, 1000, 0);

  Serial.print("Analog: ");
  Serial.print(sensorValue);
  Serial.print("  Voltage: ");
  Serial.print(voltage, 2);
  Serial.print(" V  NTU (Calibrated): ");
  Serial.print(ntu, 0);
  Serial.print("  --> ");

  // ตีความสถานะตามตาราง Calibration
  if (ntu < 50) {
    Serial.println("น้ำใส (Clear - OK)");
  } 
  else if (ntu < 200) {
    Serial.println("น้ำเริ่มมีมูล (Normal - Circulate)");
  } 
  else if (ntu < 300) {
    Serial.println("น้ำขุ่นปานกลาง (Warning)");
  } 
  else {
    Serial.println("น้ำขุ่นมาก (Trigger Pump/Filter ON)");
  }

  delay(1000);
}
