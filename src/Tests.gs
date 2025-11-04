function Test() {
  TestGenerateText(MyCalenderJSON, ExpectedResultOfMyCalenderJSON);
  TestGenerateText(MyCalenderJSON1002, ExpectedResultOfMyCalenderJSON1002);
  TestGenerateText(MyCalenderJSON1003, ExpectedResultOfMyCalenderJSON1003);
  TestGenerateText(MyCalenderJSON1007, ExpectedResultOfMyCalenderJSON1007);
  TestGenerateText(MyCalenderJSON1008, ExpectedResultOfMyCalenderJSON1008);
  TestGenerateText(MyCalenderJSON1009, ExpectedResultOfMyCalenderJSON1009);
  TestGenerateText(MyCalenderJSON1010, ExpectedResultOfMyCalenderJSON1010);
  TestGenerateText(MyCalenderJSON1022, ExpectedResultOfMyCalenderJSON1022);
  TestGenerateText(MyCalenderJSON1030, ExpectedResultOfMyCalenderJSON1030);
}

function TestGenerateText(input, expected) {
  ret = generateText(input);
  if (ret.trim() != expected.trim()) {
    //console.error("Failed: MyCalenderJSON\n" + ret);
    throw new Error("Failed: MyCalenderJSON\n" + ret);
  }
}
