// app.post("/projects/db/:sendDB", jsonParser, async (req, res) => {
//   console.log(`~ Get some Activity on Website from guest`);
//   let indent = " ".repeat(5);
//   for (let i in req.body) console.log(`${indent}=> ${req.body[i]}`);
//   console.log();

//   let { Country, ip, Visit_Date } = req.body;

//   let result = await db.findAll("Visitors", "Country", Country);
//   result = result[0] ? result[0].dataValues : undefined;

//   if (!result) await db.create("Visitors", [`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=1`]);
//   else if (!ip.includes(result.ip) || !Visit_Date.includes(result.Visit_Date))
//     await db.update("Visitors", [`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=${result.Count + 1}`]);

//   if (Number(req.params.sendDB)) {
//     let data = {};
//     data["Visitors"] = await db.print("Visitors");
//     data["Views"] = await db.print("Views");
//     res.send(data);
//   } else res.sendStatus(200);
// });

// app.get("/projects/db/:table/command/:task/:condition", (req, res) => {
//   console.log(req.params.task);

//   switch (req.params.task) {
//     case "print": {
//       db.print(req.params.table)
//         .then((data) => {
//           for (let i in data) console.log(data[i].dataValues);
//           res.send(data);
//         })
//         .catch((err) => res.status(500).send(err.message));
//       break;
//     }
//     case "findAll": {
//       db.findAll(req.params.table, ...req.params.condition.split("="))
//         .then((data) => res.send(data))
//         .catch((err) => res.status(500).send(err.message));
//       break;
//     }
//     case "create": {
//       db.create(req.params.table, req.params.condition.split(","))
//         .then((data) => res.send(data))
//         .catch((err) => res.status(500).send(err.message));
//       break;
//     }
//     case "delete": {
//       db.delete(req.params.table, ...req.params.condition.split("="))
//         .then((data) => {
//           if (data) res.send("Information was deleted successfully");
//           else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
//         })
//         .catch((err) => res.status(500).send(err.message));
//       break;
//     }
//     case "update": {
//       db.update(req.params.table, req.params.condition.split(","))
//         .then((data) => {
//           if (data) res.send("Information was updated successfully");
//           else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
//         })
//         .catch((err) => res.status(500).send(err.message));
//       break;
//     }
//     default:
//       res.status(404);
//       res.sendFile(__dirname + "/FileNotFound.html");
//   }
// });
