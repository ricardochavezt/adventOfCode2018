box_ids_2_repeated = 0
box_ids_3_repeated = 0
ARGF.each do |line|
  char_count = Hash.new(0)
  line.each_char {|c| char_count[c] = char_count[c] + 1 }
  found_repeated_2 = 0
  found_repeated_3 = 0
  char_count.each_value do |count|
    if count == 2
      found_repeated_2 = 1
    elsif count == 3
      found_repeated_3 = 1
    end
  end
  box_ids_2_repeated += found_repeated_2
  box_ids_3_repeated += found_repeated_3
end

puts box_ids_2_repeated * box_ids_3_repeated
