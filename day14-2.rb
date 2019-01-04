list_recipes = [3, 7]
intermediate_string = "37"
recipe_pos_1 = 0
recipe_pos_2 = 1

search_sequence = ARGV[0]

i = 0
loop do
  recipe_1 = list_recipes[recipe_pos_1]
  recipe_2 = list_recipes[recipe_pos_2]
  sum = recipe_1 + recipe_2
  if sum >= 10
    list_recipes.concat(sum.divmod(10))
  else
    list_recipes << sum
  end
  intermediate_string << sum.to_s

  # puts "#{sum}, #{intermediate_string}"
  index = intermediate_string.index(search_sequence)
  if index
    puts "index: #{list_recipes.size - intermediate_string.size + index}"
    puts "intermediate string: #{intermediate_string}"
    puts "last elements: #{list_recipes[list_recipes.size-intermediate_string.size, intermediate_string.size]} (#{list_recipes.size} elements total)"
    break
  end
  # if list_recipes.size > 10**6
  #   puts intermediate_string
  #   return
  # end
  if intermediate_string.size >= search_sequence.size
    intermediate_string = intermediate_string[intermediate_string.size-search_sequence.size, search_sequence.size]
  end

  recipe_pos_1 += (1 + recipe_1)
  recipe_pos_1 = recipe_pos_1 % list_recipes.size # wrap around the end of the list
  recipe_pos_2 += (1 + recipe_2)
  recipe_pos_2 = recipe_pos_2 % list_recipes.size
  # puts list_recipes.join(","), recipe_pos_1, recipe_pos_2
  # puts list_recipes
  # if list_recipes.size > 100000
  #   puts list_recipes
  #   break
  # end
  # puts intermediate_string
  i += 1
  break if i == (30 * (10**6))
  # puts i if i % 1000000 == 0
end

# puts list_recipes.size - intermediate_string.size

# puts intermediate_string
