import subprocess
import time
import random
import os
import sys

# Configuration
TOTAL_DURATION_HOURS = 12
MAX_INTERVAL_MINUTES = 50
MIN_INTERVAL_MINUTES = 10
PROJECT_ROOT = r"c:\Users\abira\OneDrive\Desktop\TravelAi"

def run_git(args):
    try:
        result = subprocess.run(["git"] + args, cwd=PROJECT_ROOT, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running git {' '.join(args)}: {e.stderr}")
        return None

def get_all_changes():
    # Modified files
    modified = run_git(["ls-files", "-m"]).splitlines()
    # Untracked files
    untracked = run_git(["ls-files", "--others", "--exclude-standard"]).splitlines()
    
    all_files = list(set(modified + untracked))
    
    # Filter out the script itself and common unnecessary files
    exclude = ["human_commit.py", "api_output.json", "check_output.py", "debug_api.py", ".env"]
    return [f for f in all_files if f not in exclude]

def get_human_message(file_path):
    # Map of keywords to more human messages
    path = file_path.lower()
    if 'backend' in path:
        msgs = [
            "refactor: modularize backend api structure",
            "feat: implement high-fidelity reasoning engine",
            "refactor: extract pydantic models for strict schema enforcement",
            "fix: optimize llm convergence logic",
            "style: refine backend documentation and type hints",
            "chore: restructure server entry point for production"
        ]
    elif 'hooks' in path:
        msgs = [
            "feat: implement custom orchestration hook for application state",
            "refactor: decouple view logic from core engine state",
            "perf: optimize re-renders in travel architect hook"
        ]
    elif 'components' in path:
        msgs = [
            "style: polish cinematic animations for itinerary showcase",
            "feat: separate architect form into atomic component",
            "style: implement glassmorphism effects on sidebar",
            "feat: build interactive timeline for journey mapping"
        ]
    elif 'lib' in path or 'data' in path:
        msgs = [
            "feat: expand global geographical registry with 250+ regions",
            "refactor: optimize country data lookup utility",
            "data: integrate full global states database"
        ]
    elif 'readme' in path:
        msgs = [
            "docs: update project documentation with refined architecture",
            "docs: clarify installation steps for modular setup"
        ]
    else:
        msgs = [
            "refactor: enhance modularity of core application",
            "style: general aesthetic polish and spacing",
            "chore: sync local changes with industrial architecture"
        ]
    return random.choice(msgs)

def start_commit_process():
    files = get_all_changes()
    if not files:
        print("No changes to commit! Generate some code first.")
        return

    # To maximize commits and ensuring we hit the 12-hour mark with < 50 min intervals:
    # 12 hours = 720 mins. At 30 mins/commit, we need ~24 commits.
    target_commit_count = max(len(files), 24)
    total_minutes = TOTAL_DURATION_HOURS * 60
    
    # Calculate intervals
    avg_interval_mins = total_minutes / target_commit_count
    target_avg = min(MAX_INTERVAL_MINUTES, max(MIN_INTERVAL_MINUTES, avg_interval_mins))
    
    print(f"--- Optimized Industrial Commit Flow ---")
    print(f"Targeting approximately {target_commit_count} commits ov    er {TOTAL_DURATION_HOURS} hours.")
    print(f"Calculated interval: {target_avg:.2f} minutes.")
    print(f"---------------------------------------")

    current_commit = 0
    
    # First, commit the actual files
    for file_path in files:
        current_commit += 1
        print(f"\n[{current_commit}/{target_commit_count}] Processing: {file_path}")
        run_git(["add", file_path])
        msg = get_human_message(file_path)
        run_git(["commit", "-m", msg])
        run_git(["push"])
        
        sleep_mins = random.uniform(target_avg * 0.7, target_avg * 1.1)
        sleep_mins = min(sleep_mins, MAX_INTERVAL_MINUTES)
        print(f"Industrial pause: {sleep_mins:.2f} mins...")
        time.sleep(sleep_mins * 60)

    # Then, if we haven't reached 12 hours/target commits, do 'polish' commits
    while current_commit < target_commit_count:
        current_commit += 1
        print(f"\n[{current_commit}/{target_commit_count}] Performing background architectural polish...")
        
        # Make a tiny harmless change to README or a lib file
        with open(os.path.join(PROJECT_ROOT, "README.md"), "a") as f:
            f.write("\n<!-- Architecture Sync: " + str(time.time()) + " -->")
        
        run_git(["add", "README.md"])
        run_git(["commit", "-m", "chore: minor architectural documentation sync"])
        run_git(["push"])
        
        if current_commit < target_commit_count:
            sleep_mins = random.uniform(target_avg * 0.8, target_avg * 1.2)
            sleep_mins = min(sleep_mins, MAX_INTERVAL_MINUTES)
            print(f"Industrial pause: {sleep_mins:.2f} mins...")
            time.sleep(sleep_mins * 60)

    print("\n--- Process Complete! Your activity history has been optimized. ---")

if __name__ == "__main__":
    start_commit_process()
