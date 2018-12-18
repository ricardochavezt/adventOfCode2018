def react_polymer(polymer)
  next_polymer = ""
  i = 0
  polymer_units = polymer.chars
  while i < polymer_units.size
    # puts "#{i}: #{polymer_units[i]}"
    if i+1 < polymer_units.size && (polymer_units[i].ord - polymer_units[i+1].ord).abs == 32
      i += 2
    else
      next_polymer << polymer_units[i]
      i += 1
    end
  end

  return next_polymer
end

def fully_react_polymer(polymer)
  loop do
    new_polymer = react_polymer(polymer)
    return new_polymer if new_polymer.size == polymer.size
    polymer = new_polymer
  end
end

polymer = ARGF.read.chomp
min_length = polymer.size
('a'..'z').each do |c|
  corrected_polymer = polymer.gsub(Regexp.new(c, Regexp::IGNORECASE), "")
  reacted_polymer = fully_react_polymer(corrected_polymer)
  min_length = reacted_polymer.size if reacted_polymer.size < min_length
end

# puts polymer
puts min_length
