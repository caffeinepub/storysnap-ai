import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

persistent actor {
  public type StoryMode = { #funny; #emotional; #bollywood; #thriller; #motivational };

  public type Story = {
    id : Text;
    title : Text;
    storyText : Text;
    mode : StoryMode;
    authorHandle : Text;
    authorId : Text;
    likes : Nat;
    shares : Nat;
    createdAt : Int;
    isPublic : Bool;
  };

  public type UserQuota = {
    dailyCount : Nat;
    isPremium : Bool;
    canCreate : Bool;
  };

  type UserInfo = { dailyCount : Nat; lastDate : Text; isPremium : Bool };

  let stories = Map.empty<Text, Story>();
  var storyIdCounter : Nat = 0;
  let userInfoMap = Map.empty<Text, UserInfo>();
  var seeded : Bool = false;

  let FREE_DAILY_LIMIT : Nat = 3;

  func dateKey(ts : Int) : Text {
    let days = ts / 86_400_000_000_000;
    days.toText();
  };

  func modeScore(s : Story) : Nat { s.shares * 3 + s.likes };

  func seed() {
    if (seeded) return;
    seeded := true;
    let now = Time.now();
    let items : [(Text, Text, StoryMode, Text, Nat, Nat, Int)] = [
      ("The Group Chat Drama", "It started with a simple hey. Priya thought it was just another Tuesday, but what followed was three hours of chaos, confessions, and a group chat meltdown that nobody saw coming. By the time the dust settled, two people had left the group, one had accidentally sent a voice note to the wrong person, and somehow everyone ended up ordering biryani together. Life, as it turns out, is written in blue ticks.", #funny, "@priya_drama", 20500, 4200, now - 7_200_000_000_000),
      ("Unsent Message", "She typed it seventeen times. Each version a little softer, a little more honest, a little more terrifying. In the end she deleted them all and sent a single word: okay. He replied with a thumbs up. She stared at the screen until the light faded. Some stories end not with a bang but with the quiet hum of a phone screen going dark.", #emotional, "@silent_hearts", 15300, 8900, now - 14_400_000_000_000),
      ("Pyaar Ka WhatsApp", "Rahul ne socha tha sirf ek good morning bhejega. Lekin jab Simran ne usi waqt good morning bheja, toh dono ka phone ek saath baj utha exactly at 6:47 AM. Destiny, they say, has read receipts. Aur agar woh read receipts blue ho jayein, toh samjho kahani shuru ho gayi.", #bollywood, "@filmy_feels", 31000, 12000, now - 21_600_000_000_000),
      ("The Last Screenshot", "He did not know it would be the last conversation. The messages were mundane, logistics, plans for the weekend, an inside joke about bad coffee. But three days later, when he scrolled back, every word felt like a clue he had missed. The detective in him wanted answers. The human in him just wanted one more reply.", #thriller, "@darkchats", 9800, 3100, now - 28_800_000_000_000),
      ("Read at 3AM", "You opened this message at 3:17 AM. That means something. Maybe the night got too loud, or too quiet. Either way you are still here, still reading. That is not a small thing. Someone, somewhere, typed these words hoping they would find you exactly at the moment you needed them. They did. Now close your phone and get some rest. Tomorrow is still yours.", #motivational, "@3am_crew", 44200, 18700, now - 36_000_000_000_000),
      ("Left on Read", "The bubble appeared. Three dots. Then nothing. She refreshed her screen four times, checked her wifi, even restarted her phone. The dots never came back. But two weeks later, at a coffee shop neither of them planned to visit, they both reached for the last croissant at the exact same time. Some conversations were always meant to finish in person.", #funny, "@leftread_life", 27600, 9400, now - 43_200_000_000_000)
    ];
    var i : Nat = 0;
    for ((title, storyText, mode, authorHandle, shares, likes, createdAt) in items.vals()) {
      let id = "seed-" # i.toText();
      let s : Story = { id = id; title = title; storyText = storyText; mode = mode; authorHandle = authorHandle; authorId = "seed"; likes = likes; shares = shares; createdAt = createdAt; isPublic = true };
      stories.add(id, s);
      i += 1;
    };
    storyIdCounter := i;
  };

  public shared func initSeed() : async () {
    seed();
  };

  public query func getTrendingStories(limit : Nat) : async [Story] {
    let all = stories.values().toArray();
    let pub = all.filter(func(s : Story) : Bool { s.isPublic });
    let sorted = pub.sort(func(a : Story, b : Story) : { #less; #equal; #greater } {
      let sa = modeScore(a);
      let sb = modeScore(b);
      if (sa > sb) #less else if (sa < sb) #greater else #equal
    });
    let cap = if (limit < sorted.size()) limit else sorted.size();
    Array.tabulate<Story>(cap, func(idx) { sorted[idx] });
  };

  public query func getStory(id : Text) : async ?Story {
    stories.get(id);
  };

  public shared ({ caller }) func createStory(
    title : Text,
    storyText : Text,
    mode : StoryMode,
    authorHandle : Text,
    isPublic : Bool
  ) : async { #ok : Story; #err : Text } {
    let callerKey = caller.toText();
    let today = dateKey(Time.now());

    let info : UserInfo = switch (userInfoMap.get(callerKey)) {
      case null { { dailyCount = 0; lastDate = today; isPremium = false } };
      case (?u) {
        if (u.lastDate == today) u
        else ({ dailyCount = 0; lastDate = today; isPremium = u.isPremium })
      };
    };

    if (not info.isPremium and info.dailyCount >= FREE_DAILY_LIMIT) {
      return #err("Daily limit reached. Upgrade to Premium for unlimited stories.");
    };

    storyIdCounter += 1;
    let id = "story-" # storyIdCounter.toText();
    let story : Story = {
      id = id;
      title = title;
      storyText = storyText;
      mode = mode;
      authorHandle = authorHandle;
      authorId = callerKey;
      likes = 0;
      shares = 0;
      createdAt = Time.now();
      isPublic = isPublic;
    };
    stories.add(id, story);
    let newInfo : UserInfo = { dailyCount = info.dailyCount + 1; lastDate = today; isPremium = info.isPremium };
    userInfoMap.add(callerKey, newInfo);
    #ok(story);
  };

  public shared func likeStory(id : Text) : async Bool {
    switch (stories.get(id)) {
      case null false;
      case (?s) {
        let updated : Story = { id = s.id; title = s.title; storyText = s.storyText; mode = s.mode; authorHandle = s.authorHandle; authorId = s.authorId; likes = s.likes + 1; shares = s.shares; createdAt = s.createdAt; isPublic = s.isPublic };
        stories.add(id, updated);
        true;
      };
    };
  };

  public shared func shareStory(id : Text) : async Bool {
    switch (stories.get(id)) {
      case null false;
      case (?s) {
        let updated : Story = { id = s.id; title = s.title; storyText = s.storyText; mode = s.mode; authorHandle = s.authorHandle; authorId = s.authorId; likes = s.likes; shares = s.shares + 1; createdAt = s.createdAt; isPublic = s.isPublic };
        stories.add(id, updated);
        true;
      };
    };
  };

  public query ({ caller }) func getUserQuota() : async UserQuota {
    let callerKey = caller.toText();
    let today = dateKey(Time.now());
    let info : UserInfo = switch (userInfoMap.get(callerKey)) {
      case null { { dailyCount = 0; lastDate = today; isPremium = false } };
      case (?u) {
        if (u.lastDate == today) u
        else ({ dailyCount = 0; lastDate = today; isPremium = u.isPremium })
      };
    };
    let canCreate = info.isPremium or (info.dailyCount < FREE_DAILY_LIMIT);
    { dailyCount = info.dailyCount; isPremium = info.isPremium; canCreate = canCreate };
  };

  public shared ({ caller }) func setPremium(premium : Bool) : async () {
    let callerKey = caller.toText();
    let today = dateKey(Time.now());
    let info : UserInfo = switch (userInfoMap.get(callerKey)) {
      case null { { dailyCount = 0; lastDate = today; isPremium = premium } };
      case (?u) { { dailyCount = u.dailyCount; lastDate = u.lastDate; isPremium = premium } };
    };
    userInfoMap.add(callerKey, info);
  };
}
