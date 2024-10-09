// const WebSocket = require("ws");
// const mqtt = require('mqtt');
// const { database } = require('./firebase.js');
const { ref, set, get } = require('firebase/database');

const initializeApp = require('firebase/app').initializeApp;
const getDatabase = require('firebase/database').getDatabase;
require('dotenv').config({ path: './.env' });

// firebase init
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase에 명령 저장하는 함수
function storeLedStatus(sector_id, state) {
    const commandRef = ref(database, `sector/${sector_id}/LED_Status/`);
    set(commandRef, {
        status: state,
    })
    .then(() => {
        console.log("Firebase 저장 성공");
    })
    .catch((error) => {
        console.log("Firebase 저장 실패: ", error);
    });
}

// storePumpStatus and add Pump_count
function storePumpStatus(sector_id, state) {
    const commandRef = ref(database, `sector/${sector_id}/Pump_Status/`);

    // Firebase에서 상태 값 읽어오기
    get(commandRef)
    .then((snapshot) => {
        let currentData = snapshot.val();

        let setData = {
            status: state,
            count: currentData && currentData.count ? currentData.count : 0
        };
        if (state === "ON"){
            setData.count += 1;
        }
        // 상태데이터 설정
        return set(commandRef, setData);
    })
    .then(() => {
        console.log("Firebase 저장 성공");
    })
    .catch((error) => {
        console.log("Firebase 저장 실패: ", error);
    });
}

storePumpStatus(1, "ON");