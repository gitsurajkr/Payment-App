import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";
import { InputLabel } from "../components/InputLabel";
import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";


export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return <div className="bg-slate-500 h-screen flex justify-center ">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-indigo-300 w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign Up"} />
        <SubHeading label={"Enter your Information to create your account"} />
        <InputLabel onChange={(e) => { setFirstName(e.target.value) }} placeholder={"John"} label="First Name" />
        <InputLabel onChange={(e) => { setLastName(e.target.value) }} placeholder={"Doe"} label="Last Name" />
        <InputLabel onChange={(e) => { setUsername(e.target.value) }} label="Email" placeholder="johndoe@gmail.com" />
        <InputLabel label="Password" type="password" placeholder="password" onChange={(e) => { setPassword(e.target.value) }} />
        <div className="pt-4">
          <Button
            onClick={async () => {
              try {
                const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                  firstName,
                  lastName,
                  username,
                  password
                });
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              } catch (error) {
                console.error("Error during signup:", error);
                alert("There was an issue with the signup. Please try again.");
              }
            }}
            label={"Sign Up"}
          />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>

}