#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// WiFi
#define WIFI_SSID "xian"
#define WIFI_PASSWORD "0639368831"

// Firebase
#define API_KEY "AIzaSyDx85lsI80he0gg_VR31dq1iHxQF6YI61s"
#define DATABASE_URL "https://aqua03-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "testabc01@gmail.com"
#define USER_PASSWORD "123456"

// Ultrasonic Sensor
#define TRIG_PIN 5
#define ECHO_PIN 18

// ขนาดฐานภาชนะ (cm)
#define WIDTH_CM 18.0f
#define LENGTH_CM 25.0f
// พื้นที่หน้าตัด (cm^2)
#define BASE_AREA_CM2 (WIDTH_CM * LENGTH_CM)

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600, 60000); // GMT+7

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("🔧 เริ่มต้นโปรแกรมแล้ว");

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");

  // Firebase Config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Sign in
  if (Firebase.signUp(&config, &auth, USER_EMAIL, USER_PASSWORD)) {
    Serial.println("✅ Firebase SignUp success!");
  } else {
    Serial.print("❌ Firebase SignUp failed: ");
    Serial.println(config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Init NTP
  timeClient.begin();

  Serial.printf("📐 พื้นที่ฐาน: %.1f cm^2 (%.0f×%.0f cm)\n", BASE_AREA_CM2, WIDTH_CM, LENGTH_CM);
}

float readDistanceCM() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034f / 2.0f; // cm
}

void loop() {
  timeClient.update();
  float height_cm = readDistanceCM();          // “สูง” จาก Ultrasonic (cm)
  if (height_cm < 0) height_cm = 0;            // กันค่าติดลบเผื่ออ่านพลาด

  // ปริมาตร (cm^3) = mL
  float volume_ml = height_cm * BASE_AREA_CM2; // mL

  // แสดงค่าเป็นทศนิยม 2 ตำแหน่ง
  String formattedHeight = String(height_cm, 2); // 2 ตำแหน่งทศนิยม
  String formattedVolume = String(volume_ml, 2); // 2 ตำแหน่งทศนิยม

  unsigned long timestamp = timeClient.getEpochTime();
  String dateTime = timeClient.getFormattedTime(); // "HH:MM:SS"

  Serial.printf("📏 Height: %.2f cm | 📦 Volume: %.2f mL\n", formattedHeight.toFloat(), formattedVolume.toFloat());
  Serial.print("🕒 Time: "); Serial.println(dateTime);

  if (Firebase.ready() && auth.token.uid.length() > 0) {
    // ใช้ UID ของผู้ใช้เป็นคีย์
    String path = "/UsersData/" + String(auth.token.uid.c_str()) + "/Distance"; // เดิม

    FirebaseJson json;
    json.set("height_cm", height_cm);           // เพิ่มฟิลด์ความสูง (cm)
    json.set("width_cm", (float)WIDTH_CM);      // เก็บขนาดฐานด้วย (อ้างอิง)
    json.set("length_cm", (float)LENGTH_CM);
    json.set("base_area_cm2", (float)BASE_AREA_CM2);
    json.set("volume_ml", volume_ml);           // ปริมาตรเป็น mL
    json.set("timestamp", dateTime);            // เวลาแบบอ่านง่าย

    if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
      Serial.println("✅ Sent to Firebase");
    } else {
      Serial.print("❌ Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }
  } else {
    Serial.println("⚠️ Firebase ยังไม่พร้อม");
  }

  delay(3000); // 3 วินาที
}
