const express = require("express");
const server = express();

let projects = [];
let totalRequests = 0;

server.use(express.json());

function checkProjectId(req, res, next) {
	let { id } = req.params;
	if(!projects[id]) {
		return res.json({
			error: `projeto com id ${id} nao existe`
		})
	}
	req.id = id;
	return next();
}

function requestsCounter(req, res, next) {
	totalRequests++;
	console.log(`${totalRequests} requisicoes feitas ate entao :)`);
	next();
}

server.use(requestsCounter);

server.post("/projects", (req, res) => {
	const { id, title, tasks } = req.body;
	projects.push({
		id, title, tasks
	});
	return res.send("projeto adicionado com sucesso");
});

server.get("/projects", (req, res) => {
	return res.json({projects});
});

server.put("/projects/:id", checkProjectId, (req, res) => {
	projects[req.id].title = req.body.title;
	return res.send(`titulo do projeto de indice ${req.id} alterado`);
});

server.delete("/projects/:id", checkProjectId, (req, res) => {
	projects.splice(req.id, 1);
	return res.send(`projeto de indice ${req.id} deletado`);
});

server.post("/projects/:id", checkProjectId, (req, res) => {
	projects[req.id].tasks.push(req.body.task);
	return res.send(`tarefa adicionada no projeto de indice ${req.id}`);
});


server.listen(4040);