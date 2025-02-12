const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const port = "https://drivana-web-test.onrender.com" || 5000;

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
    return res.status(400).json({ message: "The email is already registered." });
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };

  router.db.get("users").push(newUser).write();

  res.status(201).json(newUser);
});

server.get("/reservations", (req, res) => {
  const reservations = router.db.get("reservations").value();
  res.status(200).json(reservations);
});
server.post("/documents", (req, res) => {
  const { documents } = req.body;

  if (!Array.isArray(documents)) {
    return res.status(400).json({ message: "Documents must be an array." });
  }

  const getRandomStatus = () => {
    const statuses = ["pending", "approved", "rejected"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const dbDocuments = router.db.get("documents");

  const updatedDocuments = documents.map((newDoc) => {
    const existingDoc = dbDocuments.find({ type: newDoc.type }).value();

    const updatedDoc = {
      id: existingDoc ? existingDoc.id : Date.now() + Math.random(),
      type: newDoc.type,
      fileUrl: newDoc.fileUrl,
      status: getRandomStatus(),
    };

    if (existingDoc) {
      dbDocuments.find({ type: newDoc.type }).assign(updatedDoc).write();
    } else {
      dbDocuments.push(updatedDoc).write();
    }

    return updatedDoc;
  });

  res.status(200).json(updatedDocuments);
});
server.patch("/reservations/:id", (req, res) => {
  const id = Number(req.params.id);
  const { returnDate, status } = req.body;

  const reservation = router.db.get("reservations").find({ id }).value();

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  if (status === "Canceled") {
    router.db.get("reservations").find({ id }).assign({ status: "Canceled" }).write();
  } else if (returnDate) {
    router.db.get("reservations").find({ id }).assign({ return: returnDate }).write();
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  res.status(200).json({ message: "Reservation updated successfully" });
});

server.listen(port, () => {
  console.log(`JSON Server running at http://localhost:${port}`);
});
