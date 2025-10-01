#define SensorPin A0

void setup() {
  Serial.begin(9600);
  Serial.println("PH Sensor Test (PH-4502C)");
}

void loop() {
  int sensorValue = analogRead(SensorPin);
  float voltage = sensorValue * (5.0 / 1023.0);

  // สมการคร่าว ๆ (ต้อง Calibrate จริง)
  // กำหนดว่า 2.5V = pH 7.0, 3.0V ≈ pH 4.0, 2.0V ≈ pH 10.0
  float phValue = 7 + (2.5 - voltage) * 3.5;  

  // Clamp ค่าให้อยู่ในช่วง 0–14
  if (phValue < 0) phValue = 0;
  if (phValue > 14) phValue = 14;

  Serial.print("ADC = ");
  Serial.print(sensorValue);
  Serial.print(" | Voltage = ");
  Serial.print(voltage, 3);
  Serial.print(" V");
  Serial.print(" | pH ≈ ");
  Serial.println(phValue, 2);

  delay(1000);
}
