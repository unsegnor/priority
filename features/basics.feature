# features/basics.feature
Feature: Adding tasks

  Scenario: Adding the first task
    Given there are no tasks
    When I add the task "buy chocolate"
    Then the list of tasks should be
      | buy chocolate |

  Scenario: Adding a second task
    Given the list of tasks is
      | buy chocolate |
    When I add the task "clean up"
    Then the system should ask me which one is more important
      | buy chocolate |
      | clean up      |

  Scenario: Setting importance
    Given the list of tasks is
      | buy chocolate |
    And the system is asking me which one is more important
      | buy chocolate |
      | clean up      |
    When I answer "buy chocolate"
    Then the system sould ask which one is more urgent
      | buy chocolate |
      | clean up      |

  Scenario: Setting urgency
    Given the list of tasks is
      | buy chocolate |
    And I am adding the task "clean up"
    And I said "buy chocolate" is more important
    And the system is asking me which one is more urgent
      | buy chocolate |
      | clean up      |
    When I answer "clean up"
    Then the list of tasks is
      | buy chocolate |
      | clean up      |

  Scenario: Adding several tasks
    When adding several tasks in a row
    the system will process them one by one
    so it will not ask for the next task importance until the previous one has been set

  Scenario: Adding item more important more urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item more important
    And more urgent
    Then the list of items must be
      | clean up      |
      | buy chocolate |

  Scenario: Adding item more important equal urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item more important
    And equal urgent
    Then the list of items must be
      | clean up      |
      | buy chocolate |

  Scenario: Adding item more important less urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item more important
    And less urgent
    Then the list of items must be
      | clean up      |
      | buy chocolate |

  Scenario: Adding item equal important more urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item equal important
    And more urgent
    Then the list of items must be
      | clean up      |
      | buy chocolate |

  Scenario: Adding item equal important equal urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item equal important
    And equal urgent
    Then the list of items must be
      | buy chocolate |
      | clean up |

  Scenario: Adding item equal important less urgent
    Given the list of items is
      | buy chocolate |
    When I add a new item called "clean up"
    And I set the new item equal important
    And less urgent
    Then the list of items must be
      | buy chocolate |
      | clean up |

  Scenario: Adding item less important more urgent

  Scenario: Adding item less important equal urgent

  Scenario Adding item less important less urgent

  Scenario: Adding item to a long list
    Should minimize the comparisons