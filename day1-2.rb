require 'set'

freq = 0
seen = Set.new []

ARGF.cycle do |line|
  if seen.include? freq
    break
  else
    seen.add(freq)
  end
  freq += line.to_i
end

puts freq
