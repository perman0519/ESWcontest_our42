#include "camera_stream.hpp"

// Not tested with this model
//#define CAMERA_MODEL_WROVER_KIT

StreamServer server;
bool isCameraStreamOn = true;

const char* ws_server_ip = "10.19.208.192";
const uint16_t ws_server_port = 9999;


void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector

  Serial.begin(115200);
  Serial.setDebugOutput(false);

  if (server.camera_init() != ESP_OK)
  {
    Serial.print("\nCamera init failed with error");
    return ;
  }
  // Wi-Fi connection
  if (server.wifi_conn() == false)
  {
    Serial.printf("wifi connect failed!\n");
    return ;
  }

  if (server.ws_server_conn(ws_server_ip, ws_server_port) == false)
  {
    Serial.println("web socket server failed. check your web socket server.");
    return ;
  }
}

void loop() {
  // if (isCameraStreamOn == false)
  // {
  //   server.stop();
  // }

  if (isCameraStreamOn == true)
  {
    if (server.check_ws_server_conn() == false)
    {
      if (server.ws_server_conn(ws_server_ip, ws_server_port) == false)
      {
        Serial.println("web socket server failed. check your web socket server.");
        return ;
      }
    }

    if (server.start() == false)
    {
      Serial.printf("Error! restart plz.. \n");
      ESP.restart();
    }
  }
}
