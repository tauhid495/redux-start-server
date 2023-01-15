require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS_WARD}@cluster0.memkxat.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("Redux");
    const blogCollection = db.collection("blogs");
    const productCollection = db.collection("products");
    const userCollection = db.collection('user');
    const jobCollection = db.collection('job');

    app.post("/blog", async (req, res) => {
      const blog = req.body;

      const result = await blogCollection.insertOne(blog);

      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();
      res.send({ status: true, data: blog });
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });


    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      requestData = req.body.blog;
      // console.log(requestData.status);
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedBlog = {
        $set: {
          name: requestData.name,
          occupation: requestData.occupation,
          subject: requestData.subject,
          date: requestData.date,
          gender: requestData.gender,
          image: requestData.image,
          textarea: requestData.textarea,
          status: requestData.status,
        }
      };
      const result = await blogCollection.updateOne(query, updatedBlog, options);
      res.send(result);
    });


    // for nex class 

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    // Job Box

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send({ status: true, data: result });
    });


  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello Developer!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


