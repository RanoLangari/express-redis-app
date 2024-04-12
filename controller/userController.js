import db from "../utils/db-firestore.js";
import client from "../utils/db.js";
import bcrypt from "bcrypt";

const saltRounds = 5;

export const loginMahasiswa = async (req, res) => {
  try {
    const { nim, password } = req.body;
    const checkRedis = await client.get("mahasiswa");
    if (checkRedis) {
      const data = JSON.parse(checkRedis);
      const user = data.find((user) => user.nim === nim);
      if (user) {
        console.log(user.password);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
          return res.status(200).send({
            message: "Login berhasil",
          });
        } else {
          return res.status(400).send({
            message: "Password salah",
          });
        }
      } else {
        return res.status(400).send({
          message: "NIM tidak terdaftar",
        });
      }
    }
    const query = db.collection("mahasiswa2");
    const snapshot = await query.where("nim", "==", nim).get();
    if (snapshot.empty) {
      return res.status(400).send({
        message: "NIM tidak terdaftar",
      });
    }
    const userData = snapshot.docs[0].data();
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({
        message: "Password salah",
      });
    }
    res.status(200).send({
      status: "success",
      message: "Login berhasil",
      data: {
        id: snapshot.docs[0].id,
      },
    });
  } catch (error) {
    console.error("Error in loginMahasiswa:", error);
  }
};

export const registerMahasiswa = async (req, res) => {
  try {
    const { nim, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const query = db.collection("mahasiswa2");
    const data = {
      nim,
      password: hashPassword,
    };
    const snapshot = await query.where("nim", "==", nim).get();
    if (!snapshot.empty) {
      return res.status(400).send({
        message: "NIM sudah terdaftar",
      });
    }
    const result = await query.add(data);
    if (!result) {
      return res.status(400).send({
        message: "Register gagal",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Register berhasil",
    });
  } catch (error) {
    console.log("Error in registerMahasiswa:", error);
  }
};
