box_ids = ARGF.each.to_a
box_ids[0..box_ids.length-2].each_with_index do |id1, i|
  box_ids.drop(i+1).each do |id2|
    diff_count = 0
    common_chars = ""
    id1.each_char.zip(id2.each_char).each do |pair|
      if pair[0] != pair[1]
        diff_count += 1
      else
        common_chars << pair[0]
      end
    end
    if diff_count == 1
      puts common_chars
      exit
    end
  end
end
