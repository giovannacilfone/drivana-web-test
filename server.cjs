const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = 5000;

server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

server.use(jsonServer.bodyParser);

server.use(middlewares);

server.post("/users", (req, res) => {
  const { email, password, name } = req.body;

  const existingUsers = router.db.get("users").filter({ email }).value();
  if (existingUsers.length > 0) {
    return res.status(400).json({ message: "El email ya está registrado." });
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };

  router.db.get("users").push(newUser).write();
  console.log("Usuario creado:", newUser);

  res.status(201).json(newUser);
});

server.get("/reservations", (req, res) => {
  const reservations = router.db.get("reservations").value();
  res.status(200).json(reservations);
});

server.post("/documents", (req, res) => {
  const { userId, documents } = req.body;

  if (!userId || !Array.isArray(documents) || documents.length !== 3) {
    return res
      .status(400)
      .json({ message: "Debes enviar exactamente 3 documentos y un userId válido." });
  }

  const getRandomStatus = () => {
    const statuses = ["pending", "approved", "rejected"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const newDocuments = documents.map((doc) => ({
    id: Date.now() + Math.random(),
    userId,
    type: doc.type,
    fileUrl: doc.fileUrl,
    status: getRandomStatus(),
  }));

  router.db
    .get("documents")
    .push(...newDocuments)
    .write();

  res.status(201).json(newDocuments);
});

server.patch("/reservations/:id", (req, res) => {
  const id = Number(req.params.id);
  const { returnDate, status } = req.body;

  const reservation = router.db.get("reservations").find({ id }).value();

  if (!reservation) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }

  if (status === "Canceled") {
    router.db.get("reservations").find({ id }).assign({ status: "Canceled" }).write();
  } else if (returnDate) {
    router.db.get("reservations").find({ id }).assign({ return: returnDate }).write();
  } else {
    return res.status(400).json({ message: "Acción no válida" });
  }

  res.status(200).json({ message: "Reserva actualizada correctamente" });
});

server.listen(port, () => {
  console.log(`JSON Server corriendo en http://localhost:${port}`);
});
