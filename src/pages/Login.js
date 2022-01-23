//import hook react
import React, { useState, useEffect } from 'react';

//import hook useHitory from react router dom
import { useHistory } from 'react-router';

//import axios
import axios from 'axios';

import ReCAPTCHA from 'react-google-recaptcha';
import Countdown from 'react-countdown';

function Login() {

    //define state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // var isVerified =  false;

    //define state validation
    const [validation, setValidation] = useState([]);

    const [count, setCount] = useState(1);

    const [style, setStyle] = useState({ disabled: false });
    const [span, setSpan] = useState({ hidden: true });
    const [capctha, setCaptcha] = useState(false);

    //define history
    const history = useHistory();

    var onChange = function(response){
        console.log("response",response);
        if(response){
            setCaptcha(true);
        }
    }

    //hook useEffect
    useEffect(() => {

        //check token
        if(localStorage.getItem('token')) {

            //redirect page dashboard
            history.push('/dashboard');
        }
    }, []);

    //function "loginHandler"
    const loginHandler = async (e) => {
        e.preventDefault();

        if(capctha === false){   
            alert("The captcha field is required")
        } else {
            //initialize formData
            const formData = new FormData();

            //append data to formData
            formData.append('email', email);
            formData.append('password', password);


            //send data to server
            await axios.post('http://127.0.0.1:8000/api/login', formData)
            .then((response) => {

                //set token on localStorage
                localStorage.setItem('token', response.data.token);

                //redirect to dashboard
                history.push('/dashboard');
            })
            .catch((error) => {

                if (error.response.status === 401) {
                    setCount(count + 1)
                    if(count === 3){
                        alert("Please wait for 30 seconds");
                        setStyle({ disabled: true });
                        setSpan({ hidden: false });
                        setTimeout(function () {
                            setStyle({ disabled: false });
                            setSpan({ hidden: true });
                        }, 30000);
                    }
                }
                //assign error to state "validation"
                setValidation(error.response.data);
            })
        }
    };

    return (
        <div className="container" style={{ marginTop: "120px" }}>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                            <h4 className="fw-bold">LOGIN</h4>
                            <hr/>
                            {
                                validation.message && (
                                    <div className="alert alert-danger">
                                        {validation.message}
                                    </div>
                                )
                            }
                            <form onSubmit={loginHandler}>
                                <div className="form-group mb-3">
                                    <label className="form-label">EMAIL</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email"/>
                                </div>
                                {
                                    validation.email && (
                                        <div className="alert alert-danger">
                                            {validation.email[0]}
                                        </div>
                                    )
                                }
                                <div className="form-group mb-3">
                                    <label className="form-label">PASSWORD</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"/>
                                </div>
                                {
                                    validation.password && (
                                        <div className="alert alert-danger">
                                            {validation.password[0]}
                                        </div>
                                    )
                                }

                                <div className="form-group mb-3">
                                    <ReCAPTCHA
                                        sitekey={"6Lej3SkeAAAAAB4zGKbk0sCzVryZLwUYcotp7zI_"}
                                        render="explicit"
                                        onChange={onChange} />
                                </div>

                                <div className="form-group mb-3">
                                    <span hidden={span.hidden} style={{color: 'red'}}>Please wait for 30 seconds 
                                        <Countdown date={Date.now() + 30000}/>
                                    </span> 
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" disabled={style.disabled} className="btn btn-primary">LOGIN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Login;