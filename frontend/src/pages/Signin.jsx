import { InputLabel } from "../components/InputLabel";
import {Heading} from "../components/Heading";
import {Button} from "../components/Button";
import {SubHeading} from "../components/SubHeading";
import {BottomWarning} from "../components/BottomWarning";

export const Signin = () => {
    return <div className="bg-slate-500 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"}/>
                <SubHeading label={"Enter your Information to sign in"} />
                <InputLabel placeholder="johndoe@gmail.com" label={"Email"}/>
                <InputLabel placeholder="password" label={"Password"} type="password"/>
                <div className="pt-4">
                    <Button onClick={async()=>{
                        try{
                            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                                username,
                                password
                            });
                            localStorage.setItem("token", response.data.token);
                            navigate("/dashboard");
                        } catch (error) {
                            console.error("Error during signin:", error);
                            alert("There was an issue with the signin. Please try again.");
                        }
                    }}  label={"Sign in"}/>
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>
            </div>
        </div>
    </div>
};