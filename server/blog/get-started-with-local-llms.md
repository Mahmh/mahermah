---
title: Setting Up Local LLMs and Using Them to Solve Coding Problems
date: 2026-07-04
tags: [LLM]
img: /api/blog/assets/get-started-with-local-llms/fig3.4.png
excerpt: Set up and use local LLMs via Ollama and the Continue extension for efficient, private, and cost-effective coding tasks like refactoring, documentation, and debugging.
---

## 1. Introduction
Today, I will show how you can set up large language models locally to help you develop your projects. Local LLMs bring several benefits, including:

- **Cost-effectiveness in the long-term**: The cost of using cloud models (ChatGPT, Claude, Gemini, etc.) is increasing over time. Some developers are spending hundreds of dollars, if not thousands, every month to pay their cloud LLM API bills. On the other hand, local models are completely free to use, even though running them requires capable hardware which can be expensive. However, local LLMs tend to be cheaper in the long run because you only pay once for the hardware, and you are not tied to recurring costs for using cloud-based models.
- **Privacy and security**: When using cloud LLMs, the model providers may potentially store your codebase in their servers. Local models do not require internet access, which means you can run them on your local machine without any network connection. Also, some companies do not allow their developers to leak code/data from their codebase/ database due to security compliance, and thus local models are very helpful in this situation.

## 2. Requirements
Before we continue, make sure your machine meets the following minimum specifications:

- **RAM**: At least 16GB (32GB+ is recommended for larger models).
- **GPU**: An NVIDIA GPU with 8GB+ VRAM (e.g., RTX 3060 or newer) or an Apple Silicon Mac (M1/M2/M3 chip) is ideal. In my case, I use an RTX 4080 GPU with 16GB VRAM.
- **Storage**: At least 10GB of free space for model weights.
- **Code Editor**: We will use Visual Studio Code (VS Code) for this article.

## 3. Installing Ollama
There are multiple tools to manage local LLMs, but in this article, I will mainly focus on using **Ollama**, which is a popular tool for managing local LLMs. It simplifies the process of downloading and serving models locally.

### Installation
1.  Go to [ollama.com](https://ollama.com/).
2.  Download the installer for your specific operating system.
3.  Run the installer and follow the on-screen instructions.
4.  Once installed, open your terminal (Command Prompt, PowerShell, or Terminal) and type:
    ```bash
    ollama --version
    ```
If you see a version number, then Ollama is running successfully on your machine.

## 4. Downloading Your First Model
Ollama contains a library of open-weight models that you can download. We will download Gemma 4 (12B parameters) for agentic coding, and Qwen 2.5 Coder (1.5B parameters) for fast code auto-complete:

```sh
ollama run gemma4:12b
```

The first time you run this, Ollama will download several gigabytes of data and it will take some time. Once the download is complete, you will see a message prompt at the end of the installation:

```
$ ollama run gemma4:12b
pulling manifest 
pulling 1278394b6936: 100% ▕████████████████████████████████████▏ 7.4 GB                         
pulling 675ad6e68101: 100% ▕████████████████████████████████████▏ 174 MB/175 MB   17 MB/s   0s
pulling 0d542e0c8804: 100% ▕████████████████████████████████████▏  10 KB                         
pulling 56380ca2ab89: 100% ▕████████████████████████████████████▏   42 B                         
pulling c805f5b265d8: 100% ▕████████████████████████████████████▏  548 B                         
verifying sha256 digest 
writing manifest 
success 
>>> Send a message (/? for help)
```


You can now chat with the model directly in your terminal. Type `/bye` to exit the chat session.

After that, don't forget to download the second model:
```sh
ollama run qwen2.5-coder:1.5b
```

## 5. Setting Up Continue Extension
While chatting in the terminal is fun, it isn't initially helpful for coding because it lacks essential coding features (e.g., code auto-complete and codebase-aware chat). To make your local model actually useful for programming, we will use the **Continue** extension for VS Code. It's an extension that easily connects Ollama to VS Code so that you can leverage your downloaded Ollama models directly on your code editor.

### Installation
1.  Open VS Code.
2.  Go to the Extensions view (`Ctrl` `Shift` `X`).
3.  Search for "[Continue](https://marketplace.visualstudio.com/items?itemName=Continue.continue)" and click Install.
4.  Once installed, a new icon will appear in your side bar. Click it to open the Continue interface.
5.  Click on the settings gear icon in the Continue panel. This will open a `config.json` file, where you will configure your local LLM.
6.  Add Ollama as your local LLM provider. Your configuration should look similar to this (ignore `contextProviders` and `slashCommands` for now):

```json
{
  "models": [
    {
      "title": "Gemma 4 (12B)",
      "model": "gemma4:12b",
      "provider": "ollama"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen 2.5 Coder (1.5B)",
    "model": "qwen2.5-coder:1.5b",
    "provider": "ollama"
  },
  "contextProviders": ...,
  "slashCommands": ...,
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "qwen2.5-coder:1.5b"
  }
}
```

I recommend using a smaller, faster model like `qwen2.5-coder:1.5b` for auto-complete to ensure there is minimal delay while typing.

## 6. Using the Local LLM in a Codebase
You now have a fully functional, private AI assistant inside your editor. Here are the three main ways to use it:

1.  **Chat Interface**: Use the side panel to ask questions about your project. You can highlight a block of code and press `Cmd/Ctrl` `L` to pull that code into the chat context.
2.  **Inline Edits**: Highlight a function and press `Cmd/Ctrl` `I`. Type a command like "Refactor this function to reduce its parameters" or "Add error handling" and watch the local model rewrite the code.
3.  **Context Awareness**: You can use the `@` symbol in the chat to reference specific files, folders, or even the whole codebase. This allows the model to access more context data to produce relevant answers and better code.

Here, I picked three specific examples to illustrate the usefulness of local LLMs. Of course, there are many more use cases.

### Example 1: Context-Aware Code
In this example, I want to build a FastAPI server to serve blog articles through two endpoints: one for the article's content (`/blog/{article-name}`), and one for the article's assets (`/blog/assets/{asset}`). The 12B model of Gemma 4 supports tool use, which means it can perform agentic coding, but I found that it yields better results when using Chat mode instead of Agent mode.

This is an example codebase that contains blog articles with a currently-empty entrypoint file. I then prompt it to write code for connecting the articles to a FastAPI server.

![Figure 1.1 The prompt and the initial codebase](/api/blog/assets/get-started-with-local-llms/fig1.1.png)

Here is the resultant code. I copy-pasted the code from the chat interface to the file.

![Figure 1.2 The result](/api/blog/assets/get-started-with-local-llms/fig1.2.png)

I also created a bash script called `run.bash` then I asked it to generate the code for running the server.

![Figure 1.3 Bash script to run the server](/api/blog/assets/get-started-with-local-llms/fig1.3.png)

Another follow-up prompt:

![Figure 1.4 Another modification](/api/blog/assets/get-started-with-local-llms/fig1.4.png)

### Example 2: Refactoring & Documentation
Suppose you have a function that has too many parameters and does multiple tasks, which can happen often in production code. You can tell the model to reduce the complexity through refactoring.

In this example codebase, I have two files: `order_calculator.py` (calculating the total order based on given data) and `main.py` (test-run script).

The code for `order_calculator.py`:
```py
import datetime

GLOBAL_TAX_REGISTRY = {
    "NY": 0.08875,
    "CA": 0.0725,
    "TX": 0.0625,
    "DEFAULT": 0.05
}

CURRENT_PROMO_STRATEGY = "SEASONAL_SALE"

def calculate_order_total(
    item_name, 
    item_price, 
    item_quantity, 
    item_weight, 
    item_width, 
    item_height, 
    item_depth, 
    discount_percentage, 
    tax_rate_override, 
    shipping_method, 
    shipping_base_fee, 
    user_is_premium_member,
    promo_code_valid,
    shipping_destination_state,
    is_gift_wrap,
    gift_wrap_cost,
    coupon_code,
    loyalty_points_available,
    loyalty_points_to_redeem,
    current_inventory_level
):
    global CURRENT_PROMO_STRATEGY
    
    print(f"--- Initiating Calculation for {item_name} ---")

    if current_inventory_level <= 0:
        raise Exception("Cannot process order: Out of stock!")

    subtotal = item_price * item_quantity
    
    total_discount = 0.0
    
    if promo_code_valid:
        if coupon_code == "SUMMER24":
            total_discount += subtotal * 0.15
        elif coupon_code == "WELCOME10":
            total_discount += subtotal * 0.10
        else:
            total_discount += subtotal * (discount_percentage / 100)

    if user_is_premium_member:
        if item_quantity > 5:
            total_discount += 10.0
        else:
            total_discount += 5.0

    points_value = loyalty_points_to_redeem * 0.01
    if points_value > subtotal:
        points_value = subtotal
        print("Warning: Points redemption exceeded subtotal. Capping discount.")
    
    subtotal_after_discounts = subtotal - total_discount - points_value

    if is_gift_wrap:
        subtotal_after_discounts += gift_wrap_cost
        print("Gift wrap applied.")

    shipping_cost = shipping_base_fee
    
    volume = item_width * item_height * item_depth
    
    if item_weight > 20:
        if volume > 10000:
            shipping_cost += 50.0
        else:
            shipping_cost += 25.0
    elif volume > 5000:
        shipping_cost += 15.0

    if shipping_method == "express":
        shipping_cost *= 1.8
        if item_weight > 10:
            shipping_cost += 10
    elif shipping_method == "overnight":
        shipping_cost *= 3.0
    elif shipping_method == "ground":
        shipping_cost *= 1.0
    else:
        print("Unknown shipping method. Defaulting to ground.")
        shipping_cost = shipping_base_fee

    if tax_rate_override > 0:
        effective_tax_rate = tax_rate_override
    else:
        effective_tax_rate = GLOBAL_TAX_REGISTRY.get(
            shipping_destination_state, 
            GLOBAL_TAX_REGISTRY["DEFAULT"]
        )

    if CURRENT_PROMO_STRATEGY == "SEASONAL_SALE" and user_is_premium_member:
        if subtotal < 50.0:
            effective_tax_rate = 0.0
            print("Tax waived due to Premium Seasonal Promotion!")

    tax_amount = subtotal_after_discounts * (effective_tax_rate / 100)

    grand_total = subtotal_after_discounts + shipping_cost + tax_amount

    if grand_total > 500:
        CURRENT_PROMO_STRATEGY = "VIP_ONLY"
        print("Alert: Large order detected! Strategy updated to VIP_ONLY.")

    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "subtotal_raw": round(subtotal, 2),
        "discounts_applied": round(total_discount + points_value, 2),
        "gift_wrap_added": is_gift_wrap,
        "shipping_fees": round(shipping_cost, 2),
        "tax_amount": round(tax_amount, 2),
        "grand_total": round(grand_total, 2)
    }
```

The code for `main.py`:
```py
from order_calculator import calculate_order_total

def run():
    try:
        result = calculate_order_total(
            item_name="Industrial Drill",
            item_price=250.0,
            item_quantity=2,
            item_weight=35.0,
            item_width=15.0,
            item_height=20.0,
            item_depth=15.0,
            discount_percentage=5.0,
            tax_rate_override=0.0,
            shipping_method="express",
            shipping_base_fee=15.0,
            user_is_premium_member=True,
            promo_code_valid=True,
            shipping_destination_state="CA",
            is_gift_wrap=True,
            gift_wrap_cost=5.50,
            coupon_code="SUMMER24",
            loyalty_points_available=100,
            loyalty_points_to_redeem=50,
            current_inventory_level=10
        )
        print("\nFinal Order Receipt:")
        for key, value in result.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
            
    except Exception as e:
        print(f"Order Failed: {e}")

if __name__ == "__main__":
    run()
```

Here I made a prompt that contains 3 tasks in bullet points:

![Figure 2.1 The refactoring & documentation prompt](/api/blog/assets/get-started-with-local-llms/fig2.1.png)

![Figure 2.2 The result](/api/blog/assets/get-started-with-local-llms/fig2.2.png)

Full generated output for `order_calculator.py`:
```py
import datetime
from dataclasses import dataclass
from typing import Optional

GLOBAL_TAX_REGISTRY = {
    "NY": 0.08875,
    "CA": 0.0725,
    "TX": 0.0625,
    "DEFAULT": 0.05
}

CURRENT_PROMO_STRATEGY = "SEASONAL_SALE"

@dataclass
class OrderDetails:
    """Container for all order-related data points."""
    item_name: str
    item_price: float
    item_quantity: int
    item_weight: float
    item_width: float
    item_height: float
    item_depth: float
    discount_percentage: float
    tax_rate_override: float
    shipping_method: str
    shipping_base_fee: float
    user_is_premium_member: bool
    promo_code_valid: bool
    shipping_destination_state: str
    is_gift_wrap: bool
    gift_wrap_cost: float
    coupon_code: str
    loyalty_points_available: int
    loyalty_points_to_redeem: int
    current_inventory_level: int

def calculate_discount(details: OrderDetails) -> float:
    """
    Calculates the total discount amount based on promo codes, 
    premium membership status, and standard discounts.
    """
    subtotal = details.item_price * details.item_quantity
    total_discount = 0.0
    
    if details.promo_code_valid:
        if details.coupon_code == "SUMMER24":
            total_discount += subtotal * 0.15
        elif details.coupon_code == "WELCOME10":
            total_discount += subtotal * 0.10
        else:
            total_discount += subtotal * (details.discount_percentage / 100)

    if details.user_is_premium_member:
        total_discount += 10.0 if details.item_quantity > 5 else 5.0
        
    return total_discount

def calculate_points_value(subtotal: float, points_to_redeem: int) -> float:
    """
    Calculates the monetary value of loyalty points to be redeemed,
    capping it at the current subtotal.
    """
    points_value = points_to_redeem * 0.01
    if points_value > subtotal:
        print("Warning: Points redemption exceeded subtotal. Capping discount.")
        return subtotal
    return points_value

def calculate_shipping(details: OrderDetails) -> float:
    """
    Calculates the shipping cost based on dimensions, weight, 
    and selected delivery method.
    """
    cost = details.shipping_base_fee
    volume = details.item_width * details.item_height * details.item_depth
    
    if details.item_weight > 20:
        cost += 50.0 if volume > 10000 else 25.0
    elif volume > 5000:
        cost += 15.0

    if details.shipping_method == "express":
        cost *= 1.8
        if details.item_weight > 10:
            cost += 10
    elif details.shipping_method == "overnight":
        cost *= 3.0
    elif details.shipping_method == "ground":
        cost *= 1.0
    else:
        print("Unknown shipping method. Defaulting to ground.")
        cost = details.shipping_base_fee
    
    return cost

def determine_tax_rate(details: OrderDetails, subtotal_after_discount: float) -> float:
    """
    Determines the applicable tax rate based on overrides, 
    geographic location, and promotional rules.
    """
    if details.tax_rate_override > 0:
        return details.tax_rate_override
    
    rate = GLOBAL_TAX_REGISTRY.get(details.shipping_destination_state, GLOBAL_TAX_REGISTRY["DEFAULT"])
    
    if CURRENT_PROMO_STRATEGY == "SEASONAL_SALE" and details.user_is_premium_member:
        if subtotal_after_discount < 50.0:
            print("Tax waived due to Premium Seasonal Promotion!")
            return 0.0
    return rate

def calculate_order_total(details: OrderDetails) -> dict:
    """
    Main entry point to calculate total order costs by delegating 
    specific calculations to helper functions.
    """
    global CURRENT_PROMO_STRATEGY
    
    print(f"--- Initiating Calculation for {details.item_name} ---")

    if details.current_inventory_level <= 0:
        raise Exception("Cannot process order: Out of stock!")

    subtotal = details.item_price * details.item_quantity
    discount = calculate_discount(details)
    points_val = calculate_points_value(subtotal, details.loyalty_points_to_redeem)
    
    subtotal_after_discounts = subtotal - discount - points_val

    if details.is_gift_wrap:
        subtotal_after_discounts += details.gift_wrap_cost
        print("Gift wrap applied.")

    shipping_cost = calculate_shipping(details)
    tax_rate = determine_tax_rate(details, subtotal_after_discounts)
    
    tax_amount = subtotal_after_discounts * (tax_rate / 100)
    grand_total = subtotal_after_discounts + shipping_cost + tax_amount

    if grand_total > 500:
        CURRENT_PROMO_STRATEGY = "VIP_ONLY"
        print("Alert: Large order detected! Strategy updated to VIP_ONLY.")

    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "subtotal_raw": round(subtotal, 2),
        "discounts_applied": round(discount + points_val, 2),
        "gift_wrap_added": details.is_gift_wrap,
        "shipping_fees": round(shipping_cost, 2),
        "tax_amount": round(tax_amount, 2),
        "grand_total": round(grand_total, 2)
    }
```

At least for this simple example, not only did the model perform the 3 given tasks but it also added type annotations. It used Python `dataclass` to avoid mentioning the same parameters, which is a good practice used in production code. Although the new code has more lines than the original (due to documentation & separation of functions), it is now easier to read and when developers add more functionality to the code, using good practices will make the total lines of code increase in a lower rate than the original code.

I then told the model to adjust `main.py`:

![Figure 2.3 The prompt to adjust the script file](/api/blog/assets/get-started-with-local-llms/fig2.3.png)

```py
from order_calculator import calculate_order_total, OrderDetails

def run():
    try:
        # Instantiate the data container for the order
        order = OrderDetails(
            item_name="Industrial Drill",
            item_price=250.0,
            item_quantity=2,
            item_weight=35.0,
            item_width=15.0,
            item_height=20.0,
            item_depth=15.0,
            discount_percentage=5.0,
            tax_rate_override=0.0,
            shipping_method="express",
            shipping_base_fee=15.0,
            user_is_premium_member=True,
            promo_code_valid=True,
            shipping_destination_state="CA",
            is_gift_wrap=True,
            gift_wrap_cost=5.50,
            coupon_code="SUMMER24",
            loyalty_points_available=100,
            loyalty_points_to_redeem=50,
            current_inventory_level=10
        )

        result = calculate_order_total(order)
        print("\nFinal Order Receipt:")
        for key, value in result.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
            
    except Exception as e:
        print(f"Order Failed: {e}")

if __name__ == "__main__":
    run()
```

In a real project, you would use a prompt similar to the last one for updating any file depending on the one that was edited by the LLM, but in this case I'm showing a script that calls the order total calculator function.

### Example 3: Debugging
We can use a model to help us locate where errors are coming from, especially in complicated codebases. This is a good use case where, if you don't want AI to write your code, you can at least use it to search for error-causing code and lines that are suspected to cause issues.

This time, I will use a more capable model that my hardware supports: **Qwen 3.6 (35B)**. It is a downloadable model that has better agentic capabilities compared to the smaller models we talked about. Agentic coding means that the model can traverse around the codebase, read & write files, and run certain commands after you have given it permission.

Suppose I have a web app for chatting. The front-end codebase contains about 20 files (excluding `node_modules` directory), and it displays a weird error when you run the app.

![Figure 3.1](/api/blog/assets/get-started-with-local-llms/fig3.1.png)

I pasted the error into the prompt and pressed Enter to see if the model is able to locate the error and troubleshoot it without guidance.

![Figure 3.2](/api/blog/assets/get-started-with-local-llms/fig3.2.png)

![Figure 3.3](/api/blog/assets/get-started-with-local-llms/fig3.3.png)

After figuring out where the issue is, you can fix it yourself, but in this case I approved the model's solution by clicking Apply. The generated code resolved the error.

![Figure 3.4](/api/blog/assets/get-started-with-local-llms/fig3.4.png)

![Figure 3.5](/api/blog/assets/get-started-with-local-llms/fig3.5.png)

But now, when you type a message (like "hi") in the chat input of the web app, it displays another error.

![Figure 3.6](/api/blog/assets/get-started-with-local-llms/fig3.6.png)

This one appears to be a bit more complicated than the previous one. Let's now see what the model will do.

![Figure 3.7](/api/blog/assets/get-started-with-local-llms/fig3.7.png)

![Figure 3.8](/api/blog/assets/get-started-with-local-llms/fig3.8.png)

![Figure 3.9](/api/blog/assets/get-started-with-local-llms/fig3.9.png)

After applying the changes, the error was also resolved without further issues.

![Figure 3.10](/api/blog/assets/get-started-with-local-llms/fig3.10.png)

## 7. Conclusion
Now, you might notice that those examples appear to be manufactured and relatively simple. Local LLMs, especially the smaller ones, need specific instructions to make them useful, and they struggle when code complexity increases. You often need to adjust the prompt and retry to make the model achieve the desired goal. However, as the LLM industry grows over time, I expect open-source models to achieve better results and run faster on consumer hardware, becoming more accessible to more people. You should try to experiment between models that have more parameters and see how you can use the most out of your hardware, since larger models typically produce better outputs and are easier to work with.

Setting up a local LLM workflow is very beneficial for developers who don't want their code to be stored in cloud servers, and those that want to spend money once on hardware rather than spend perpetually on models. While the initial hardware investment may be higher, you have the ability to use infinite amounts of tokens without being charged heavily, while keeping your proprietary code from leaving your computer.

Thank you for reading. If you found this guide helpful, share it with your other people who you think might find useful.