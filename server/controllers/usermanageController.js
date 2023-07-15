
// GET admin page

exports.dashbord = async (req,res)=>{

    res.render('index',{admin:true})
}