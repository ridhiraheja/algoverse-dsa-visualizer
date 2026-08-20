# 🌟 AlgoVerse — Interactive Data Structures & Algorithms Visualizer

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](#)

> **AlgoVerse** is an interactive, full-stack Data Structures and Algorithms (DSA) visualization platform and multi-language code execution IDE. Built with React, Vite, and a Python FastAPI backend execution engine, AlgoVerse makes learning algorithms intuitive, step-by-step, and visual.

---

## 📌 Short Repository Description (For GitHub About Section)

```text
🚀 Interactive DSA Visualizer & Multi-Language IDE built with React, Vite, and Python FastAPI engine. Features step-by-step canvas animations, C++/Java/Python/JS compiler, Big-O complexity handbook, algorithm games, and dark/light notebook themes.
```

---

## ✨ Key Features

- 🎨 **Interactive Step Animations**: Live step-by-step canvas visualizers for arrays, dynamic programming matrices, graph node networks, binary trees, and backtracking grids.
- 💻 **Multi-Language IDE & Compiler**: Interactive Monaco Code Editor supporting **C++ (g++)**, **Java (javac)**, **C (gcc)**, **Python 3**, and **JavaScript** with real-time compilation and execution console output.
- 📖 **Algorithm Complexity Handbook**: Comprehensive Big-O time and space complexity handbook featuring C++ default implementation codes with one-click **"Run in IDE"** execution.
- 🎮 **Fun Zone Games**: Interactive algorithm puzzle games including N-Queens Board Placement, Sudoku Solver, and Rat in a Maze.
- 📊 **Benchmark & Algorithm Comparison**: Side-by-side performance benchmarking and execution timing across multiple sorting algorithms.
- ☀️ **Dark & Light Notebook Themes**: Modern off-white notebook paper theme in Light Mode and sleek dark slate theme in Dark Mode.

---

## 🗂️ Algorithm Categories Supported

1. **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort.
2. **Searching Algorithms**: Linear Search, Binary Search.
3. **Dynamic Programming (DP)**: 0/1 Knapsack, Longest Common Subsequence (LCS), Climbing Stairs, Fibonacci Series, Kadane's Algorithm.
4. **Greedy Algorithms**: Activity Selection, Fractional Knapsack, Boats to Save People, Stone Piles Removal.
5. **Two Pointers**: Two Sum (Sorted Array), Container With Most Water, Floyd's Tortoise & Hare Cycle Detection.
6. **Graph Algorithms**: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path, Prim's & Kruskal's MST, A* Search.
7. **Tree Algorithms**: Binary Search Tree (BST) Construction, AVL Tree Rotations.
8. **Backtracking**: N-Queens Solver, Sudoku Solver, Rat in a Maze.
9. **Number Theory & Math**: Sieve of Eratosthenes Prime Generator.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Lucide Icons, Framer Motion, Monaco Editor (`@monaco-editor/react`), HTML5 Canvas & SVG graphics.
- **Backend API**: Python 3.13, FastAPI, Uvicorn server, `g++` (ucrt64) / `gcc` compiler wrappers, JDK `javac` engine.
- **State & Theme**: React Context API for audio sound feedback and persistent dark/light theme management.

---

## 🚀 Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/algoverse-dsa-visualizer.git
cd algoverse-dsa-visualizer
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Backend Setup
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --port 8000 --reload
```
API running at `http://127.0.0.1:8000`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
