list_recipes = [3, 7]
recipe_pos_1 = 0
recipe_pos_2 = 1

number_of_recipes = ARGV[0].to_i

while list_recipes.size < (number_of_recipes+10)
  recipe_1 = list_recipes[recipe_pos_1]
  recipe_2 = list_recipes[recipe_pos_2]
  sum = recipe_1 + recipe_2
  if sum >= 10
    list_recipes.concat(sum.divmod(10))
  else
    list_recipes << sum
  end

  recipe_pos_1 += (1 + recipe_1)
  recipe_pos_1 = recipe_pos_1 % list_recipes.size # wrap around the end of the list
  recipe_pos_2 += (1 + recipe_2)
  recipe_pos_2 = recipe_pos_2 % list_recipes.size
  # puts list_recipes.join(","), recipe_pos_1, recipe_pos_2
end

puts list_recipes[number_of_recipes, 10].join
