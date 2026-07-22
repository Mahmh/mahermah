---
title: Methods to Make Local LLMs Run Faster on your Hardware
date: 2026-07-22
tags: [LLM, Quantization]
img: /api/blog/assets/optimizing-local-llms/thumbnail.webp
excerpt: Use mixture-of-experts models, quantization, and llama.cpp make large open-weight LLMs faster and more efficient to run on your hardware.
---

## 1. Introduction
As discussed in our guide on [Setting Up Local LLMs](/blog/get-started-with-local-llms), running models locally offers privacy and cost benefits. However, the larger, better models typically require significant amounts of RAM, VRAM, and disk space. In this post, I will explain 3 methods that make running such models feasible and faster on consumer hardware: mixture-of-experts, quantization, and using an efficient inference engine. I also have a list of open-weight models (both mixture-of-experts and quantized models) downloaded on my disk so that I can compare how much disk space they take, their input processing and output generation speeds, and more.

## 2. Optimization Methods
### Mixture of Experts (MoE)
MoE models have two types of parameters: total and active.

**Total parameters** represent the entire size of the model, including all the "experts" (sub-networks) available. While this number can be very large, it does not directly correlate with the computational cost during inference.

**Active parameters** represent the specific subset of parameters actually used to process an input token. In a standard MoE architecture, a gating network (or router) dynamically selects only a few experts to handle each token.

This architecture provides huge benefits. Because only a fraction of the total parameters are active for any given forward pass, the model achieves the capacity of a massive model while maintaining the per-token compute closer to that of a much smaller one. For example, an MoE model with 100B total and 5B active parameters can rapidly produce tokens while still having a very high parameter count on consumer hardware. Also, different experts can learn to specialize in different types of data or tasks, leading to higher overall quality.

However, while the amount of computations is reduced, you still have to keep all model parameters accessible in RAM, VRAM, or storage for routing to the correct experts.

MoE models usually have a naming convention like `ExampleModel-100B-A5B`. The number after the A indicates the number of active parameters.

### Quantization
Quantization is a technique that sacrifices the precision of model parameters to allow massive models to run on hardware. It shrinks the parameters enough to fit in RAM and VRAM. There are also some cases where large LLMs are not even possible to load without quantization.

When browsing models on Hugging Face or Ollama, you'll see tags such as `Q4_K_M`. These indicate how the models were compressed. Common tags or types include:


| Weight Format | Explanation |
| ----------------- | ---------------------------------------------------------------- |
| `FP32` | Uses 32-bit floating-point parameters. Highest precision, but also the largest file size and memory use.             |
| `FP16` | Uses 16-bit floating-point parameters. About half the size of `FP32` with very little quality loss.                    |
| `INT8` | Stores parameters as 8-bit integers. Uses much less memory while usually keeping good model quality.                 |
| `INT4` | Stores parameters using 4 bits. Much smaller than `FP16`, but quality depends on the quantization method.              |
| `Q2_K` | A very small GGUF quantization using roughly 2-3 bits per weight. Saves memory but can noticeably reduce quality. |
| `Q3_K_S` | Small 3-bit K-quant. Uses the least memory among the Q3 variants, with the greatest quality loss.                 |
| `Q3_K_M` | Medium 3-bit K-quant. Balances size and quality better than `Q3_K_S`.                                             |
| `Q3_K_L` | Large 3-bit K-quant. Uses more memory than other Q3 variants but keeps more model quality.                        |
| `Q4_0` | An older 4-bit quantization format. Small and widely supported, but usually lower quality than newer K-quants.    |
| `Q4_1` | An older 4-bit format with slightly better quality than `Q4_0`, but also a slightly larger size.                  |
| `Q4_K_S` | Small 4-bit K-quant. Prioritizes lower memory use while offering better quality than older 4-bit formats.         |
| `Q4_K_M` | Medium 4-bit K-quant. A popular balance of model quality, speed, and memory use.                                  |
| `Q5_0` / `Q5_1`     | Older 5-bit quantization formats. Higher quality than Q4 formats, but usually replaced by newer Q5 K-quants.      |
| `Q5_K_S` | Small 5-bit K-quant. Offers high quality with slightly lower memory use than `Q5_K_M`. |
| `Q5_K_M` | Medium 5-bit K-quant. Keeps more quality than Q4 while remaining much smaller than FP16. |
| `Q6_K` | A roughly 6-bit K-quant. Very close to full model quality, but uses more memory than Q4 or Q5. |
| `Q8_0` | An 8-bit GGUF quantization. Large compared with Q4 and Q5, but usually keeps nearly all model quality. |


The number after `Q` indicates the approximate bits per weight (higher numbers use more memory but preserve more model quality). The suffix `_K` denotes the newer K-quant method, which is generally preferred over the older legacy variants (e.g., `_0` and `_1`). For K-quants, the final suffix (`_S` for small, `_M` for medium, and `_L` for large) indicates the trade-off between size and quality. The medium-sized type generally provides a good balance between size and quality.

### Using llama.cpp
llama.cpp is an open-source C/C++ inference engine for running large language models locally. This is not directly about the model, but I found llama.cpp to be the most efficient in loading the parameters and performing inference. It also makes it easy to convert supported models to GGUF and experiment with quantization formats.

## 3. Models
I have four open-weight models that I have downloaded and experimented with. The table shows data that you can view before downloading the models plus some metrics I have measured. Note that my setup was an NVIDIA RTX 4080, 16 GB VRAM, 96 GB RAM, and llama.cpp (with default options) for the inference backend.

| Model | Total Parameters | Active Parameters | Weight Format | Size on Disk | Load Time | Prompt Processing Speed | Generation Speed |
| ------- | ---------------- | ------- | ----- | -------- | --------- | ----------- | ----- |
| [Gemma 4](https://huggingface.co/unsloth/gemma-4-26B-A4B-it-GGUF) | 26B | 4B | `UD-Q4_K_M`   | 17.6 GB      | 26s       | 41.5 tokens/s | 51.4 tokens/s    |
| [Qwen 3.6](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF)   | 35B | 3B | `UD-Q4_K_M`   | 23.0 GB      | 29s       | 694 tokens/s | 59.2 tokens/s    |
| [Qwen 3.5](https://huggingface.co/unsloth/Qwen3.5-122B-A10B-GGUF) | 122B | 10B | `UD-Q4_K_XL`  | 77.0 GB      | 1min 30s  | 117 tokens/s | 15.3 tokens/s    |
| [Qwen 3.5](https://huggingface.co/unsloth/Qwen3.5-122B-A10B-GGUF) | 122B | 10B | `F16`         | 249.5 GB     | 5min 2s   | 2.16 tokens/s | 1.87 tokens/s    |


The first two models have the same quantization type but different parameter count, while the last two models have the same parameter count but different quantization types.

Notice that Gemma 4 has less total parameters but more active parameters, while Qwen 3.6 is the opposite, yet Qwen 3.6 produces tokens faster than Gemma 4. The last two records represent the same model but different quantization types. The quantized one uses 3$\times$ smaller disk space, has 8$\times$ higher generation speed, and takes less time to load than the non-quantized one. Token generation is usually more memory-bandwidth-bound than compute-bound because CPUs and GPUs can perform arithmetic faster than the system can move model weights through memory.

## 4. Conclusion
LLms can be made much more practical on consumer hardware by combining MoE architectures, quantization, and an efficient inference engine such as llama.cpp. MoE reduces the amount of computation required per token, while quantization lowers storage and memory requirements and can significantly improve generation speed. Total parameter count alone does not determine the whole performance. Active parameters, weight format, memory bandwidth, and backend efficiency all matter.

Thank you for reading. If you found this guide helpful, share it with your other people who you think might find useful.