package main

import (
	"container/ring"
	"fmt"
	"os"
	"strconv"
)

func main() {
	numPlayers, _ := strconv.Atoi(os.Args[1])
	numMarbles, _ := strconv.Atoi(os.Args[2])

	marbles := ring.New(1)
	marbles.Value = 0
	currentMarble := marbles
	currentPlayer := 0
	playerScores := make([]int, numPlayers)
	for i := 1; i <= numMarbles; i++ {
		currentPlayer++
		if currentPlayer > numPlayers {
			currentPlayer = 1
		}
		if i%23 == 0 {
			score := i
			marbleToRemove := currentMarble.Move(-7)
			score += marbleToRemove.Value.(int)
			currentMarble = marbleToRemove.Prev()
			currentMarble.Unlink(1)
			currentMarble = currentMarble.Next()
			playerScores[currentPlayer-1] += score
		} else {
			newMarble := ring.New(1)
			newMarble.Value = i
			currentMarble.Next().Link(newMarble)
			currentMarble = newMarble
		}
		// fmt.Print("[", currentPlayer, "]")
		// marbles.Do(func(value interface{}) {
		// 	if value == currentMarble.Value {
		// 		fmt.Print("(", value.(int), ") ")
		// 	} else {
		// 		fmt.Print(value.(int), " ")
		// 	}
		// })
		// fmt.Println("")
	}
	highestScore := 0
	for _, score := range playerScores {
		if score > highestScore {
			highestScore = score
		}
	}
	fmt.Println(highestScore)
}
