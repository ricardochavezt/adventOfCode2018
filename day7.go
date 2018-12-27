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

func canBeCompleted(node *GraphNode, completed []rune) bool {
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

func main() {
	graph := parseSteps()

	available := findFirstSteps(graph)
	completed := []rune{}

	i := 0
	for len(available) > 0 {
		// fmt.Printf("i: %d, available: %v, completed: %v\n", i, available, completed)
		step := available[i]
		if canBeCompleted(graph[step], completed) {
			available = append(available[:i], available[i+1:]...)
			for _, nextStep := range graph[step].Successors {
				available = orderedInsert(available, nextStep)
			}
			if !contains(completed, step) {
				completed = append(completed, step)
			}
			i = 0
		} else {
			i++
			if i >= len(available) {
				i = 0
			}
		}
	}

	printResult(completed)
}
