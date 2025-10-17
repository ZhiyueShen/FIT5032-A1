/**
 * 清理 Firestore 中的 users 集合，只保留指定用户并导入标准数据
 * 作者: Zhiyue (FIT5032 A3)
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import fs from "fs";

// === 你的 Firebase 配置 ===
const firebaseConfig = {
  apiKey: "AIzaSyCtsA0YWhXDjT9PR8mM8GCsZey5scdgL7M",
  authDomain: "fit5032-a1-dd6a2.firebaseapp.com",
  projectId: "fit5032-a1-dd6a2",
  storageBucket: "fit5032-a1-dd6a2.appspot.com",
  messagingSenderId: "207455869828",
  appId: "1:207455869828:web:86b18584b7d6cc33c71bd1",
};

// 初始化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 读取 JSON 文件（用户数据）
const data = JSON.parse(fs.readFileSync("./user_data.json", "utf-8"));

// 要保留的用户名称
const keepNames = ["Admin", "uwu", "abcde"];

async function cleanAndImportUsers() {
  const colRef = collection(db, "users");

  console.log("🧹 正在清理旧用户...");
  const snap = await getDocs(colRef);
  let deleteCount = 0;

  // 删除不在保留名单内的用户
  for (const d of snap.docs) {
    const userData = d.data();
    if (!keepNames.includes(userData.name)) {
      await deleteDoc(doc(db, "users", d.id));
      deleteCount++;
      console.log(`❌ 已删除非保留用户: ${userData.name || "未知用户"}`);
    }
  }

  console.log(`✅ 已删除 ${deleteCount} 个非保留用户。`);

  console.log("📦 开始导入标准用户数据...");
  for (const [i, item] of data.entries()) {
    try {
      const newRef = doc(colRef);
      await setDoc(newRef, item);
      console.log(`✅ (${i + 1}/${data.length}) 导入成功：${item.name}`);
    } catch (err) {
      console.error(`❌ 导入失败 (${item.name || "Unknown"}):`, err);
    }
  }

  console.log("🎉 所有符合标准的用户导入完成！");
}

cleanAndImportUsers();



