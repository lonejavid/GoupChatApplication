const form = document.forms[0]

form.addEventListener('submit' , async(e)=>{
    try{
        e.preventDefault()
        
        
        const data = {
            
            email : e.target.email.value,
            
            password : e.target.password.value
        }
        const res = await axios.post('http://localhost:5000/user/login', data)
        console.log(res)
        if(res.status == 200){
            alert('logged in successfully');
            console.log("token is",res.data.token)
            localStorage.setItem('token' , res.data.token)
            window.location = 'index.html'
        }



    }catch(e){
        console.log(e)
        alert(e.response.data.msg)
    }
})