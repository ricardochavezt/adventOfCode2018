freq = 0
ARGF.each do |line|
  freq += line.to_i
end

puts freq
