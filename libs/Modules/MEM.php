<?php

    namespace Modules;

    class MEM extends \ld\Modules\Module {
        protected $name = 'MEM';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();
			
			exec(
                "/usr/bin/vmstat -s |awk '{print $1\":\"$3}'",
                $result
            );

            $result = array_filter($result);

		foreach ($result as $a) {
		$p = explode(':', $a);

                $data[$p[1]] = $p[0];
		if($p[1] == "buffer")
		break;
            }
	    return $data;
        }
    }
