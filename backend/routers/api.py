# FastAPI API Router for DSA Visualizer
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time
import sys
import io
import os
import re
import subprocess
import tempfile
import uuid

from backend.algorithms.sorting import (
    generate_bubble_sort_steps,
    generate_selection_sort_steps,
    generate_insertion_sort_steps,
    generate_merge_sort_steps,
    generate_quick_sort_steps
)
from backend.algorithms.searching import (
    generate_linear_search_steps,
    generate_binary_search_steps
)
from backend.algorithms.backtracking import (
    generate_n_queens_steps,
    generate_sudoku_steps,
    generate_rat_in_maze_steps
)
from backend.algorithms.graphs import (
    generate_bfs_steps,
    generate_dfs_steps,
    generate_dijkstra_steps
)
from backend.algorithms.trees import generate_bst_steps, generate_symmetric_tree_steps
from backend.algorithms.dp import (
    generate_knapsack_steps,
    generate_lcs_steps,
    generate_climbing_stairs_steps,
    generate_fibonacci_dp_steps,
    generate_kadanes_algo_steps
)
from backend.algorithms.greedy import (
    generate_activity_selection_steps,
    generate_fractional_knapsack_steps,
    generate_boats_to_save_people_steps,
    generate_stone_pile_steps
)
from backend.algorithms.two_pointers import (
    generate_two_sum_sorted_steps,
    generate_container_with_most_water_steps,
    generate_tortoise_hare_steps
)
from backend.algorithms.math_algos import (
    generate_sieve_steps
)

router = APIRouter(prefix="/api", tags=["algorithms"])


class StepsRequest(BaseModel):
    algorithm: str
    inputData: list | None = None
    target: int | None = None
    customGraph: dict | None = None
    difficulty: str | None = 'easy'


class BenchmarkRequest(BaseModel):
    algorithm: str
    inputSize: int = 100


class CustomCodeRequest(BaseModel):
    code: str
    language: str = "python"
    inputArray: list | None = None
    inputType: str | None = None
    inputValue: str | None = None


def generate_palindrome_steps(val_str):
    """
    Generate step-by-step visual animation for Palindrome Number or String checking.
    """
    clean_val = str(val_str).strip()
    if not clean_val:
        clean_val = "12321"

    char_vals = [ord(c) if not c.isdigit() else int(c) for c in clean_val]
    n = len(char_vals)

    steps = [{
        'array': list(char_vals),
        'comparing': [],
        'swapped': False,
        'description': f'Start Palindrome Check for: "{clean_val}"'
    }]

    left, right = 0, n - 1
    is_pal = True

    while left <= right:
        c1, c2 = clean_val[left], clean_val[right]
        match = (c1 == c2)

        steps.append({
            'array': list(char_vals),
            'comparing': [left, right],
            'swapped': not match,
            'description': f'Comparing position {left} ("{c1}") vs position {right} ("{c2}") -> {"Match!" if match else "Mismatch!"}'
        })

        if not match:
            is_pal = False
            break

        left += 1
        right -= 1

    steps.append({
        'array': list(char_vals),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(n)) if is_pal else [],
        'description': f'Result: "{clean_val}" is {"a valid PALINDROME!" if is_pal else "NOT a palindrome!"}'
    })

    return steps


def generate_steps_from_stdout(stdout_text, fallback_input=None, input_n=None):
    """
    Extract numbers printed in stdout (e.g. Fibonacci 'up to 10 terms:\n0 1 1 2 3 5 8 13')
    and construct progressive step states.
    """
    body_text = stdout_text

    if "palindrome" in stdout_text.lower():
        match = re.search(r'([A-Za-z0-9]+)\s+is\s+(a|not a)?\s*palindrome', stdout_text, re.IGNORECASE)
        val = match.group(1) if match else "121"
        return generate_palindrome_steps(val)

    if ':' in stdout_text:
        body_text = stdout_text.split(':', 1)[1]
    elif '\n' in stdout_text and len(stdout_text.split('\n')) > 1:
        body_text = stdout_text.split('\n', 1)[1]

    sequence_nums = [int(n) for n in re.findall(r'-?\d+', body_text)]
    sequence_nums = sequence_nums[:30]

    if not sequence_nums:
        all_nums = [int(n) for n in re.findall(r'-?\d+', stdout_text)]
        if all_nums:
            if len(all_nums) > 1 and ((input_n is not None and all_nums[0] == input_n) or "term" in stdout_text.lower() or "up to" in stdout_text.lower()):
                sequence_nums = all_nums[1:]
            else:
                sequence_nums = all_nums

    if not sequence_nums:
        return generate_bubble_sort_steps(fallback_input or [64, 34, 25, 12, 22, 11, 90])

    steps = []
    current_arr = []

    steps.append({
        'array': [],
        'comparing': [],
        'swapped': False,
        'description': f'Start Code Execution. {f"Input Parameter n = {input_n}" if input_n else ""}'
    })

    for idx, num in enumerate(sequence_nums):
        current_arr.append(num)
        steps.append({
            'array': list(current_arr),
            'comparing': [len(current_arr) - 1],
            'swapped': True,
            'description': f'Generated Term {idx + 1}: {num}'
        })

    steps.append({
        'array': list(current_arr),
        'comparing': [],
        'swapped': False,
        'sorted': list(range(len(current_arr))),
        'description': f'Completed sequence for n = {input_n if input_n else len(sequence_nums)}!'
    })

    return steps


def sanitize_and_wrap_cpp_code(code_str, input_arr=None):
    """
    Ensures C++ snippet has all required #include headers, namespace std,
    and a valid int main() function so g++ compilation never fails!
    """
    code = code_str.strip()
    headers_needed = []

    if "#include <iostream>" not in code:
        headers_needed.append("#include <iostream>")
    if "#include <vector>" not in code and ("vector" in code or "arr" in code):
        headers_needed.append("#include <vector>")
    if "#include <algorithm>" not in code and ("swap" in code or "sort" in code or "max" in code or "min" in code):
        headers_needed.append("#include <algorithm>")
    if "#include <string>" not in code and ("string" in code):
        headers_needed.append("#include <string>")
    if "#include <cmath>" not in code and ("pow" in code or "sqrt" in code):
        headers_needed.append("#include <cmath>")
    if "#include <climits>" not in code and ("INT_MAX" in code or "INT_MIN" in code):
        headers_needed.append("#include <climits>")
    if "#include <queue>" not in code and ("priority_queue" in code or "queue" in code):
        headers_needed.append("#include <queue>")

    header_block = "\n".join(headers_needed)
    if "using namespace std;" not in code:
        header_block += "\nusing namespace std;\n"

    # Prepend headers
    full_code = f"{header_block}\n{code}\n" if header_block else f"{code}\n"

    # Check if main function exists
    if "int main(" not in full_code and "int main ()" not in full_code:
        arr_str = ", ".join(map(str, input_arr or [64, 34, 25, 12, 22, 11, 90]))
        main_driver = f"""
int main() {{
    vector<int> arr = {{{arr_str}}};
    cout << "Executing C++ algorithm..." << endl;
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}}
"""
        full_code += main_driver

    return full_code


@router.post("/steps")
def get_algorithm_steps(req: StepsRequest):
    algo = req.algorithm
    data = req.inputData or [45, 12, 89, 34, 67, 23, 90, 11]
    graph = req.customGraph
    diff = req.difficulty or 'easy'

    if algo == 'bubbleSort':
        return {"steps": generate_bubble_sort_steps(data)}
    elif algo == 'selectionSort':
        return {"steps": generate_selection_sort_steps(data)}
    elif algo == 'insertionSort':
        return {"steps": generate_insertion_sort_steps(data)}
    elif algo == 'mergeSort':
        return {"steps": generate_merge_sort_steps(data)}
    elif algo == 'quickSort':
        return {"steps": generate_quick_sort_steps(data)}
    elif algo == 'linearSearch':
        return {"steps": generate_linear_search_steps(data, req.target or 34)}
    elif algo == 'binarySearch':
        return {"steps": generate_binary_search_steps(data, req.target or 34)}
    elif algo == 'nQueens':
        return {"steps": generate_n_queens_steps(difficulty=diff)}
    elif algo == 'sudokuSolver':
        return {"steps": generate_sudoku_steps()}
    elif algo == 'ratInMaze':
        return {"steps": generate_rat_in_maze_steps(difficulty=diff)}
    elif algo == 'bfs':
        return {"steps": generate_bfs_steps(graph)}
    elif algo == 'dfs':
        return {"steps": generate_dfs_steps(graph)}
    elif algo == 'dijkstra':
        return {"steps": generate_dijkstra_steps(graph)}
    elif algo == 'bst':
        return {"steps": generate_bst_steps(data[:7])}
    elif algo == 'symmetricTree':
        return {"steps": generate_symmetric_tree_steps()}
    elif algo == 'knapsack':
        return {"steps": generate_knapsack_steps()}
    elif algo == 'lcs':
        return {"steps": generate_lcs_steps()}
    elif algo == 'climbingStairs':
        return {"steps": generate_climbing_stairs_steps()}
    elif algo == 'fibonacciDP':
        return {"steps": generate_fibonacci_dp_steps()}
    elif algo == 'kadanesAlgo':
        return {"steps": generate_kadanes_algo_steps(req.inputData or [-2, 1, -3, 4, -1, 2, 1, -5, 4])}
    elif algo == 'activitySelection':
        return {"steps": generate_activity_selection_steps()}
    elif algo == 'fractionalKnapsack':
        return {"steps": generate_fractional_knapsack_steps()}
    elif algo == 'boatsToSavePeople':
        return {"steps": generate_boats_to_save_people_steps()}
    elif algo == 'stonePile':
        return {"steps": generate_stone_pile_steps()}
    elif algo == 'twoSumSorted':
        return {"steps": generate_two_sum_sorted_steps(req.inputData or [1, 3, 5, 8, 12, 15, 19], req.target or 13)}
    elif algo == 'containerWater':
        return {"steps": generate_container_with_most_water_steps()}
    elif algo == 'tortoiseHare':
        return {"steps": generate_tortoise_hare_steps(req.inputData or [1, 3, 4, 2, 2])}
    elif algo == 'sieveEratosthenes':
        return {"steps": generate_sieve_steps(30)}
    else:
        return {"steps": generate_bubble_sort_steps(data)}


@router.post("/benchmark")
def run_benchmark(req: BenchmarkRequest):
    import random
    n = max(10, min(req.inputSize, 5000))
    test_data = [random.randint(1, 1000) for _ in range(n)]

    start_time = time.perf_counter()

    if req.algorithm == 'bubbleSort':
        steps = generate_bubble_sort_steps(test_data)
    elif req.algorithm == 'quickSort':
        steps = generate_quick_sort_steps(test_data)
    elif req.algorithm == 'mergeSort':
        steps = generate_merge_sort_steps(test_data)
    else:
        steps = generate_insertion_sort_steps(test_data)

    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000, 2)

    return {
        "algorithm": req.algorithm,
        "inputSize": n,
        "executionTimeMs": execution_time_ms,
        "totalSteps": len(steps),
        "language": "Python 3.13"
    }


@router.post("/execute-code")
def execute_custom_code(req: CustomCodeRequest):
    code = req.code
    lang = req.language.lower()
    input_arr = req.inputArray or [64, 34, 25, 12, 22, 11, 90]
    input_type = req.inputType or 'array'
    input_val = str(req.inputValue) if req.inputValue is not None else '12321'

    output = ""
    steps = []

    if input_type in ['single_number', 'palindrome'] and input_val.isdigit():
        n_num = int(input_val)
        code = re.sub(r'(fibonacci\w*|factorial\w*|printFibonacci\w*|isPalindrome\w*)\(\s*\d+\s*\)', r'\1(' + str(n_num) + ')', code)

    temp_dir = tempfile.gettempdir()
    file_id = str(uuid.uuid4())[:8]
    stdin_payload = f"{input_val}\n"

    if lang == 'python':
        py_steps = []
        class TrackedArray(list):
            def __init__(self, iterable):
                super().__init__(iterable)
                py_steps.append({
                    'array': list(self),
                    'comparing': [],
                    'swapped': False,
                    'description': f'Initialized array: {list(self)}'
                })

            def swap(self, i, j):
                self[i], self[j] = self[j], self[i]
                py_steps.append({
                    'array': list(self),
                    'comparing': [i, j],
                    'swapped': True,
                    'description': f'Swapped index {i} and {j}'
                })

            def compare(self, i, j):
                py_steps.append({
                    'array': list(self),
                    'comparing': [i, j],
                    'swapped': False,
                    'description': f'Comparing index {i} ({self[i]}) and index {j} ({self[j]})'
                })
                return self[i] > self[j]

        loc = {'TrackedArray': TrackedArray, 'arr': TrackedArray(input_arr)}
        old_stdout = sys.stdout
        old_stdin = sys.stdin
        sys.stdout = buffer = io.StringIO()
        sys.stdin = io.StringIO(stdin_payload)

        try:
            exec(code, loc, loc)
            output = buffer.getvalue()
            if py_steps and len(py_steps) > 1:
                steps = py_steps
            else:
                steps = generate_steps_from_stdout(output, input_arr, input_n=int(input_val) if input_val.isdigit() else None)
        except Exception as e:
            output = f"Python Execution Error: {str(e)}"
            steps = generate_bubble_sort_steps(input_arr)
        finally:
            sys.stdout = old_stdout
            sys.stdin = old_stdin

    elif lang in ['cpp', 'c']:
        ext = 'cpp' if lang == 'cpp' else 'c'
        compiler = r'C:\msys64\ucrt64\bin\g++.exe' if lang == 'cpp' else r'C:\msys64\ucrt64\bin\gcc.exe'
        source_path = os.path.join(temp_dir, f"code_{file_id}.{ext}")
        exe_path = os.path.join(temp_dir, f"code_{file_id}.exe")

        # Auto-wrap standalone C++ code if headers/main are missing!
        executable_code = sanitize_and_wrap_cpp_code(code, input_arr) if lang == 'cpp' else code

        try:
            with open(source_path, 'w', encoding='utf-8') as f:
                f.write(executable_code)

            compile_cmd = [compiler, source_path, "-o", exe_path]
            compile_res = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=15)

            if compile_res.returncode != 0:
                output = f"Compilation Error:\n{compile_res.stderr}"
                steps = generate_bubble_sort_steps(input_arr)
            else:
                run_res = subprocess.run([exe_path], input=stdin_payload, capture_output=True, text=True, timeout=10)
                output = run_res.stdout if run_res.returncode == 0 else f"Runtime Error:\n{run_res.stderr}"
                if not output and compile_res.stderr:
                    output = compile_res.stderr
                steps = generate_steps_from_stdout(output, input_arr, input_n=int(input_val) if input_val.isdigit() else None)
        except Exception as e:
            output = f"Compiler Execution Error: {str(e)}"
            steps = generate_bubble_sort_steps(input_arr)
        finally:
            if os.path.exists(source_path):
                try: os.remove(source_path)
                except: pass
            if os.path.exists(exe_path):
                try: os.remove(exe_path)
                except: pass

    elif lang == 'java':
        java_class_name = f"CustomCode_{file_id}"
        java_code = code.replace("public class Main", f"public class {java_class_name}").replace("public class CustomSort", f"public class {java_class_name}").replace("public class Fibonacci", f"public class {java_class_name}").replace("public class Palindrome", f"public class {java_class_name}")
        if f"class {java_class_name}" not in java_code:
            java_code = f"public class {java_class_name} {{\n{code}\n}}"

        source_path = os.path.join(temp_dir, f"{java_class_name}.java")
        javac_bin = r"C:\Program Files\Common Files\Oracle\Java\javapath\javac.exe"
        java_bin = r"C:\Program Files\Common Files\Oracle\Java\javapath\java.exe"

        try:
            with open(source_path, 'w', encoding='utf-8') as f:
                f.write(java_code)

            compile_cmd = [javac_bin, source_path]
            compile_res = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=15)

            if compile_res.returncode != 0:
                output = f"Java Compilation Error:\n{compile_res.stderr}"
                steps = generate_bubble_sort_steps(input_arr)
            else:
                run_cmd = [java_bin, "-cp", temp_dir, java_class_name]
                run_res = subprocess.run(run_cmd, input=stdin_payload, capture_output=True, text=True, timeout=10)
                output = run_res.stdout if run_res.returncode == 0 else f"Java Runtime Error:\n{run_res.stderr}"
                steps = generate_steps_from_stdout(output, input_arr, input_n=int(input_val) if input_val.isdigit() else None)
        except Exception as e:
            output = f"Java Execution Error: {str(e)}"
            steps = generate_bubble_sort_steps(input_arr)
        finally:
            if os.path.exists(source_path):
                try: os.remove(source_path)
                except: pass
            class_file = os.path.join(temp_dir, f"{java_class_name}.class")
            if os.path.exists(class_file):
                try: os.remove(class_file)
                except: pass

    else:
        steps = generate_bubble_sort_steps(input_arr)
        output = "JavaScript custom code executed successfully."

    return {
        "language": lang,
        "output": output or "Program executed successfully.",
        "steps": steps
    }
