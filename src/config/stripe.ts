import Stripe from "stripe";
import {env} from "../validations/envValidation"


const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default stripe;