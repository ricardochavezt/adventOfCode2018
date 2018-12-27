package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"sort"
)

type GraphNode struct {
	Id           rune
	Successors   []rune
	Predecessors []rune
}

func parseSteps() map[rune]*GraphNode {
	graph := make(map[rune]*GraphNode)
	re := regexp.MustCompile("Step ([A-Z]) must be finished before step ([A-Z]) can begin\\.")

	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		match := re.FindStringSubmatch(line)
		from := []rune(match[1])
		to := []rune(match[2])
		fromNode, ok := graph[from[0]]
		if ok {
			fromNode.Successors = append(fromNode.Successors, to[0])
		} else {
			graph[from[0]] = &GraphNode{
				Id:         from[0],
				Successors: []rune{to[0]},
			}
		}
		toNode, ok := graph[to[0]]
		if ok {
			toNode.Predecessors = append(toNode.Predecessors, from[0])
		} else {
			graph[to[0]] = &GraphNode{
				Id:           to[0],
				Predecessors: []rune{from[0]},
			}
		}
	}

	for _, node := range graph {
		sort.Slice(node.Successors, func(i, j int) bool {
			return node.Successors[i] < node.Successors[j]
		})
		// fmt.Printf("Node: %d, successors: %v, predecessors: %v\n", id, node.Successors, node.Predecessors)
	}

	return graph
}

func findFirstSteps(graph map[rune]*GraphNode) []rune {
	var firstSteps []rune
	for key, node := range graph {
		if len(node.Predecessors) == 0 {
			firstSteps = append(firstSteps, key)
		}
	}
	sort.Slice(firstSteps, func(i, j int) bool {
		return firstSteps[i] < firstSteps[j]
	})
	return firstSteps
}

func contains(list []rune, elem rune) bool {
	for _, e := range list {
		if e == elem {
			return true
		}
	}
	return false
}

func canBeStarted(node *GraphNode, completed []rune) bool {
	for _, e := range node.Predecessors {
		if !contains(completed, e) {
			return false
		}
	}
	return true
}

func printResult(steps []rune) {
	s := string(steps)
	fmt.Println(s)
}

func orderedInsert(list []rune, elem rune) []rune {
	foundIndex := len(list)
	for i, e := range list {
		if e >= elem {
			foundIndex = i
			break
		}
	}
	if foundIndex >= len(list) {
		list = append(list, elem)
	} else if list[foundIndex] != elem {
		list = append(list, 0)
		copy(list[foundIndex+1:], list[foundIndex:])
		list[foundIndex] = elem
	}
	return list
}

type Worker struct {
	Number    int
	Id        rune
	StartTime int
	Busy      bool
}

const numWorkers = 5
const timeDelta = 60

func initWorkers() []*Worker {
	workers := make([]*Worker, numWorkers)
	for i := 0; i < len(workers); i++ {
		workers[i] = &Worker{Number: i}
	}
	return workers
}

func getIdleWorker(workers []*Worker) *Worker {
	for _, w := range workers {
		if !w.Busy {
			return w
		}
	}
	return nil
}

func doWork(workers []*Worker, time int) []rune {
	// work work work work work :D
	fmt.Print("time: ", time)
	newlyCompleted := []rune{}
	for _, worker := range workers {
		if worker.Busy {
			fmt.Print(" ", worker.Id)
			finishTime := worker.StartTime + (int(worker.Id-'A') + timeDelta)
			if time >= finishTime {
				worker.Busy = false
				newlyCompleted = append(newlyCompleted, worker.Id)
				worker.Id, worker.StartTime = 0, 0
			}
		} else {
			fmt.Print(" .")
		}
	}
	fmt.Println("")
	return newlyCompleted
}

func assignToWorker(task rune, worker *Worker, currentTime int) {
	worker.Id = task
	worker.Busy = true
	worker.StartTime = currentTime
	// fmt.Println("assigned task ", task, "to worker", *worker, "current time:", currentTime)
}

func allWorkersBusy(workers []*Worker) bool {
	for _, w := range workers {
		if !w.Busy {
			return false
		}
	}
	return true
}

func allWorkersIdle(workers []*Worker) bool {
	for _, w := range workers {
		if w.Busy {
			return false
		}
	}
	return true
}

func assignWork(workers []*Worker, available []rune, currentTime int) []rune {
	idleWorker := getIdleWorker(workers)
	var step rune
	for len(available) > 0 {
		if idleWorker == nil {
			break
		}
		step, available = available[0], available[1:]
		assignToWorker(step, idleWorker, currentTime)
		idleWorker = getIdleWorker(workers)
	}
	return available
}

func addAvailableTasks(available []rune, graph map[rune]*GraphNode, newlyCompleted []rune, completed []rune) []rune {
	for _, step := range newlyCompleted {
		nextSteps := graph[step].Successors
		for _, nextStep := range nextSteps {
			if canBeStarted(graph[nextStep], completed) {
				available = orderedInsert(available, nextStep)
			}
		}
	}
	return available
}

func main() {
	graph := parseSteps()

	available := findFirstSteps(graph)
	completed := []rune{}

	workers := initWorkers()

	clock := 0
	for len(available) > 0 || !allWorkersIdle(workers) {
		available = assignWork(workers, available, clock)
		newlyCompleted := doWork(workers, clock)
		for _, step := range newlyCompleted {
			if !contains(completed, step) {
				completed = append(completed, step)
			}
		}
		available = addAvailableTasks(available, graph, newlyCompleted, completed)
		clock++
	}

	printResult(completed)
	fmt.Println(clock)
}
