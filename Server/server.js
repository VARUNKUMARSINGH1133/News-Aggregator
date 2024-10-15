require("dotenv").config();
const express= require ("express");
const axios= require("axios")
const cors= require("cors")

const app= express();
app.use(cors());
app.use(express.urlencoded({extended:true}))

const API_KEY= process.env.API_KEY;

function fetchNews(url,res){
    axios.get(url)
    .then(response =>{
        if(response.data.totalResults>0){
            res.json({
                status: 200,
                success: true,
                message: "Successfully fetched the data",
                data: response.data
            });
        }else{
            res.json({
                status:200,
                success: true,
                message:"No more data to load"
            })
        }
    })
    .catch(error=>{
        res.json({
            status: 500,
            success: false,
            message: "Failes to load data",
            error: error.message
        })
    })
}
app.get("/all-news",(req,res)=>{
    let pageSize=parseInt(req.query.pageSize)||40;
    let page= parseInt(req.query.page)||1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res);
});

app.options("/top-headlines",cors());
app.get("/top-headlines",(req,res)=>{
    let pageSize=parseInt(req.query.pageSize)||40;
    let page= parseInt(req.query.page)||1;
    let category= req.query.category || "business";
    let url= `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res);
});

app.options("/country/:iso",cors());
app.get("/country/:iso",(req,res)=>{
    let pageSize=parseInt(req.query.pageSize)||40;
    let page= parseInt(req.query.page)||1;
    const country= req.params.iso;
    let url= `https://newsapi.org/v2/top-headlines?country=${country}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res);
});

const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at PORT: ${PORT}`);
})
