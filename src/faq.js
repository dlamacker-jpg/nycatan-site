// Rules and FAQ content.
// Sources: nycatan.com "How It Works" (NYCatan format) and the official CATAN Championship
// tournament rules at catanevents.com/cnc-rules. Items in [BRACKETS] need an organizer to fill in.

export const FAQ = [
  {
    section: 'Before you come',
    items: [
      {
        q: 'Who can play?',
        a: 'Anyone 18 or older who lives in the United States. Bring an official ID, and if your ID does not show a US address, bring a piece of mail such as a utility bill sent to a US residential address.'
      },
      {
        q: 'Where and when?',
        a: 'Brooklyn Game Labs, 479 7th Ave, Brooklyn, NY 11215. Prelims start at 9:30am and run about 5 to 6 hours. Semifinals and the final start around 5pm.'
      },
      {
        q: 'How much does it cost, and can I get a refund?',
        a: '[ORGANIZER: entry fee and refund policy]'
      },
      {
        q: 'What should I bring?',
        a: 'ID and proof of residency. The BCP app on your phone, signed in with the email you registered with, so you can see your table and seat. [ORGANIZER: anything else, e.g. food, water, a pen]'
      },
      {
        q: 'What if I am late?',
        a: '[ORGANIZER: late arrival policy]'
      }
    ]
  },
  {
    section: 'How the day works',
    items: [
      {
        q: 'What is the format?',
        a: 'Everyone plays 3 prelim games at 4-player tables. At two-day qualifiers, Saturday and Sunday prelims are scored separately and your better day counts. The top 16 overall play one semifinal game at 4 tables. The 4 table winners play the final.'
      },
      {
        q: 'How are prelim standings ranked?',
        a: 'By number of wins. Ties are broken by total victory points across your prelim games, then by VP%: your score divided by the total points at your table, added up across games. After that, more second place finishes, then more thirds, then drawing lots.'
      },
      {
        q: 'What does the winner get?',
        a: 'At qualifiers, the winner earns a spot at the 2026 CATAN Regional Championship. The top 16 across the regionals go on to US Nationals, and the national champion plays at the World Championship.'
      },
      {
        q: 'I already won a qualifier this season. Can I play another one?',
        a: 'Not another qualifier. Winners of a current season qualifier cannot play in additional qualifiers before the next National Championship. [ORGANIZER: confirm whether they can still play non-qualifier events]'
      },
      {
        q: 'How do I find my table?',
        a: 'Seating and standings are posted in the BCP app. Make sure your registration email matches your BCP account.'
      }
    ]
  },
  {
    section: 'Rules at the table',
    items: [
      {
        q: 'How is the board set up?',
        a: 'The organizers generate the layout. Every table uses the same layout for a given round, and each round gets a new one. Port tokens are not used. You get 5 minutes to study the board, which can end early if everyone at the table agrees.'
      },
      {
        q: 'How are seats, colors and turn order picked?',
        a: 'In prelims, players pick chairs and colors in play order: first player picks a chair, then a color, then the second player, and so on. This step is timed at 2 minutes. Initial placements are timed at 2 minutes per placement, 3 minutes for a double placement.'
      },
      {
        q: 'Are turns timed?',
        a: 'The official rules allow either a 90 second turn with a 10 minute time bank, or timed turns of about 2 minutes once a game passes one hour. [ORGANIZER: which option NYCatan uses]'
      },
      {
        q: 'When can I trade?',
        a: 'Only in the trading and building phase, after the dice are resolved. Keep your cards hidden and make offers out loud. Players who are not the active player can propose trades to each other during discussion but cannot exchange cards. Offers are not binding.'
      },
      {
        q: 'Can I give someone a card for free?',
        a: 'No. Free resources are not allowed in one trade or across a series of trades, including "insurance" or port deals that net out to a free card. First offense is a warning and all cards involved go back to the supply. Repeat offenses can lead to disqualification.'
      },
      {
        q: 'What if a die rolls off the table?',
        a: 'If either die is fully obscured (off the table, in a cup or pocket), reroll both. If a die is cocked, balance the other die on top. If it slides off, reroll both. Use a dice tray or cup when one is available.'
      },
      {
        q: 'What are the development card rules?',
        a: 'Keep newly bought cards separate and hidden until played. You cannot play a card on the turn you buy it, except a victory point card that gives you your 10th point.'
      },
      {
        q: 'I forgot to move the robber. Now what?',
        a: 'If you have not taken any other action yet, such as starting a trade, place the robber and steal as normal. Otherwise the robber goes to the desert and nobody is robbed. Negotiating over where the robber goes is allowed.'
      },
      {
        q: 'Can I show my cards?',
        a: 'No. Showing resource or development cards, or revealing your hand, gets a warning. Repeat offenses mean playing with your resource cards face up until the end of your next turn.'
      },
      {
        q: 'How does the game end?',
        a: 'You must reach 10 points and declare victory on your own turn. If you have 10 points and forget to say so, you have to wait until your next turn. All players sign the record sheet at the end.'
      },
      {
        q: 'Is kingmaking allowed?',
        a: 'No. Intentionally handing another player the win with no benefit to yourself is prohibited, as is colluding to help someone advance. Playing for your own ranking, including dragging out a game to improve your standing, is allowed.'
      },
      {
        q: 'Something went wrong at my table. What do I do?',
        a: 'Pause the game and call a judge right away. Judge rulings are final. Anything not reported when it happens counts as normal play and cannot change the result later.'
      },
      {
        q: 'Can I use apps or AI to help me?',
        a: 'No. AI software is explicitly prohibited under the CATAN Code of Conduct.'
      }
    ]
  }
];
